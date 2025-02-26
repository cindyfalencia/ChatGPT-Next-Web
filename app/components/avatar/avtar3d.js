import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getAvatarUrl } from "../../../app/utils/get-avatar";

export function Avatar3d({ userId, ...props }) {
  const group = useRef();
  const { scene } = useThree();
  const [avatarUrl, setAvatarUrl] = useState("/fix.glb"); // Default to fix.glb
  const [useFallbackAnimation, setUseFallbackAnimation] = useState(false);
  const [loading, setLoading] = useState(true);

  const gltf = useGLTF(avatarUrl);
  const { nodes, materials, animations } = gltf;
  const { actions } = useAnimations(animations, group);

  // Fetch avatar URL from Supabase
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;
      const url = await getAvatarUrl(userId);
      if (url) {
        console.log("✅ Loaded avatar URL:", url);
        setAvatarUrl(url);
      }
      setLoading(false);
    };

    fetchAvatar();
  }, [userId]);

  console.log("🔄 useGLTF Loaded Model:", gltf);
  console.log("🛠 Nodes:", gltf.nodes);
  console.log("🛠 Materials:", gltf.materials);
  console.log("🎭 Animations:", gltf.animations);

  useEffect(() => {
    if (!animations || animations.length === 0) {
      console.warn("No animations found, switching to fallback animations.");
      setUseFallbackAnimation(true);
    } else {
      setUseFallbackAnimation(false);
    }
  }, [animations]);

  // Ensure the animation runs
  useEffect(() => {
    console.log("Available Actions:", actions);
    if (actions?.Waving) {
      console.log("Playing Waving Animation");
      actions.Waving.play();
    } else {
      console.warn("No Waving animation found!");
    }
  }, [actions]);

  // Set up lighting in the scene
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const spotlight = new THREE.SpotLight(0xffffff, 1.5);
    spotlight.position.set(0, 4, 2);
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;

    scene.add(ambientLight);
    scene.add(spotlight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(spotlight);
    };
  }, [scene]);

  // Animation control function
  const handleStumble = () => {
    if (actions.stagger && actions.Waving) {
      actions.Waving.fadeOut(0.5);
      actions.stagger.reset().fadeIn(0.5).play();
      setTimeout(() => {
        actions.stagger.fadeOut(0.5);
        actions.Waving.reset().fadeIn(0.5).play();
      }, 4000);
    }
  };

  if (loading || !nodes || !materials) {
    console.log("⏳ Loading model...");
    return null; // Prevent rendering until model is ready
  }

  return (
    <group ref={group} {...props} dispose={null} onClick={handleStumble}>
      <group name="Scene">
        <group name="Avatar">
          <skinnedMesh
            name="avaturn_body"
            geometry={nodes.avaturn_body?.geometry}
            material={materials.avaturn_body_material}
            skeleton={nodes.avaturn_body?.skeleton}
          />
          <primitive object={nodes.Hips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/fix.glb");
