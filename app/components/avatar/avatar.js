import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Avatar(props) {
  const group = useRef();
  const { scene } = useThree();
  const { nodes, materials, animations } = useGLTF("/fix.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions.Waving.play();
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

  return (
    <group ref={group} {...props} dispose={null} onClick={handleStumble}>
      <group name="Scene">
        <group name="Avatar">
          <skinnedMesh
            name="avaturn_body"
            geometry={nodes.avaturn_body.geometry}
            material={materials.avaturn_body_material}
            skeleton={nodes.avaturn_body.skeleton}
          />
          <skinnedMesh
            name="avaturn_glasses_0"
            geometry={nodes.avaturn_glasses_0.geometry}
            material={materials.avaturn_glasses_0_material}
            skeleton={nodes.avaturn_glasses_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_glasses_1"
            geometry={nodes.avaturn_glasses_1.geometry}
            material={materials.avaturn_glasses_1_material}
            skeleton={nodes.avaturn_glasses_1.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_0"
            geometry={nodes.avaturn_hair_0.geometry}
            material={materials.avaturn_hair_0_material}
            skeleton={nodes.avaturn_hair_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1"
            geometry={nodes.avaturn_hair_1.geometry}
            material={materials.avaturn_hair_1_material}
            skeleton={nodes.avaturn_hair_1.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0"
            geometry={nodes.avaturn_look_0.geometry}
            material={materials.avaturn_look_0_material}
            skeleton={nodes.avaturn_look_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0"
            geometry={nodes.avaturn_shoes_0.geometry}
            material={materials.avaturn_shoes_0_material}
            skeleton={nodes.avaturn_shoes_0.skeleton}
          />
          <primitive object={nodes.Hips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/fix.glb");
