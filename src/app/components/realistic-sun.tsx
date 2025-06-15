"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import * as THREE from "three"

export default function RealisticSun() {
  const sunRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const flareGroupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  // Create sun shader material
  const sunMaterial = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        // Add surface turbulence
        vec3 pos = position;
        float noise = sin(pos.x * 10.0 + time) * cos(pos.y * 10.0 + time) * sin(pos.z * 10.0 + time);
        pos += normal * noise * 0.02;
        
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float brightness;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      float noise(vec3 p) {
        return sin(p.x * 10.0 + time * 0.5) * cos(p.y * 10.0 + time * 0.3) * sin(p.z * 10.0 + time * 0.7);
      }
      
      void main() {
        // Create dynamic surface patterns
        float n1 = noise(vPosition * 2.0);
        float n2 = noise(vPosition * 4.0 + vec3(100.0));
        float n3 = noise(vPosition * 8.0 + vec3(200.0));
        
        float pattern = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
        
        // Mix colors based on pattern and position
        vec3 baseColor = mix(color1, color2, pattern * 0.5 + 0.5);
        baseColor = mix(baseColor, color3, abs(pattern) * 0.3);
        
        // Add radial gradient
        float dist = length(vUv - 0.5);
        float radial = 1.0 - smoothstep(0.0, 0.5, dist);
        
        // Combine effects
        vec3 finalColor = baseColor * (0.8 + radial * 0.4) * brightness;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xffff80) }, // Bright yellow
        color2: { value: new THREE.Color(0xff8833) }, // Orange
        color3: { value: new THREE.Color(0xff2200) }, // Red
        brightness: { value: 1.0 },
      },
    })
  }, [])

  // Create corona shader material
  const coronaMaterial = useMemo(() => {
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform vec3 glowColor;
      uniform float time;
      varying vec3 vNormal;
      
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        gl_FragColor = vec4(glowColor, 1.0) * intensity * pulse;
      }
    `

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0xff6600) },
        time: { value: 0 },
      },
    })
  }, [])

  // Create solar flares
  const createSolarFlare = () => {
    if (!flareGroupRef.current) return

    const flareGeometry = new THREE.BufferGeometry()
    const flareCount = 20
    const positions = new Float32Array(flareCount * 3)
    const colors = new Float32Array(flareCount * 3)

    const angle = Math.random() * Math.PI * 2
    const height = 2 + Math.random() * 4

    for (let i = 0; i < flareCount; i++) {
      const t = i / (flareCount - 1)
      const radius = 5 + t * height
      const offsetAngle = angle + (Math.random() - 0.5) * 0.2

      positions[i * 3] = Math.cos(offsetAngle) * radius
      positions[i * 3 + 1] = Math.sin(offsetAngle) * radius * (0.5 + Math.random() * 0.5)
      positions[i * 3 + 2] = Math.sin(offsetAngle) * radius * 0.3

      const intensity = 1 - t
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.5 + intensity * 0.5
      colors[i * 3 + 2] = intensity * 0.3
    }

    flareGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    flareGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const flareMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2,
      transparent: true,
      opacity: 0.8,
    })

    const flare = new THREE.Line(flareGeometry, flareMaterial)
    flare.rotation.x = Math.random() * Math.PI * 2
    flare.rotation.y = Math.random() * Math.PI * 2
    flare.rotation.z = Math.random() * Math.PI * 2

    flareGroupRef.current.add(flare)

    // Remove flare after some time
    setTimeout(() => {
      if (flareGroupRef.current) {
        flareGroupRef.current.remove(flare)
      }
    }, 3000)
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Update shader uniforms
    if (sunMaterial.uniforms) {
      sunMaterial.uniforms.time.value = time

      // Calculate brightness based on mouse proximity
      const distance = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y)
      const brightness = 1 + (1 - Math.min(distance, 1)) * 1.5
      sunMaterial.uniforms.brightness.value = brightness
    }

    if (coronaMaterial.uniforms) {
      coronaMaterial.uniforms.time.value = time
    }

    // Rotate sun
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002
      sunRef.current.rotation.x += 0.001
    }

    // Rotate corona
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.001
      coronaRef.current.rotation.z += 0.0005
    }

    // Rotate flare group
    if (flareGroupRef.current) {
      flareGroupRef.current.rotation.y += 0.003
      flareGroupRef.current.rotation.x += 0.001
    }

    // Create flares periodically
    if (Math.random() < 0.005) {
      createSolarFlare()
    }
  })

  return (
    <group>
      {/* Main sun sphere */}
      <Sphere ref={sunRef} args={[5, 128, 128]} material={sunMaterial} />

      {/* Corona effect */}
      <Sphere ref={coronaRef} args={[6.5, 64, 64]} material={coronaMaterial} />

      {/* Solar flares container */}
      <group ref={flareGroupRef} />

      {/* Lighting */}
      <pointLight position={[0, 0, 0]} intensity={2} color={new THREE.Color(0xffaa00)} distance={100} />
      <ambientLight intensity={0.3} />

      {/* Orbit Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enableZoom
        minDistance={8}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </group>
  )
} 