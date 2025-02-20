"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Avatar3d } from "./avtar3d";
import styles from "./chat.module.scss";

interface AvatarContainerProps {
  userId: string;
}

const AvatarContainer = ({ userId }: AvatarContainerProps) => {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);

  // Function to fetch GLB from DB
  const fetchGlb = async () => {
    const response = await fetch(`/api/glb/get?userId=${userId}`);
    const data = await response.json();
    if (data.glb_url) {
      setGlbUrl(data.glb_url);
    }
  };

  useEffect(() => {
    fetchGlb();

    // Listener for Avaturn downloads
    const handleDownload = async (event: any) => {
      const fileName = event.detail?.fileName;
      const fileBlob = event.detail?.fileBlob;

      if (fileName?.endsWith(".glb") && fileBlob) {
        console.log("Avaturn GLB file detected:", fileName);

        // Convert Blob to File
        const file = new File([fileBlob], fileName, {
          type: "model/gltf-binary",
        });

        // Upload to DB
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        const uploadResponse = await fetch("/api/glb/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.url) {
          console.log("Avatar uploaded:", uploadData.url);
          fetchGlb(); // Refresh avatar
        }
      }
    };

    // Listen for Avaturn file downloads
    window.addEventListener("avaturn-download", handleDownload);

    return () => {
      window.removeEventListener("avaturn-download", handleDownload);
    };
  }, [userId]);

  return (
    <div className={styles["chat-body-avatar-container"]}>
      <Canvas shadows camera={{ position: [0, 1.7, 2], fov: 30 }}>
        <Environment preset="studio" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minDistance={1.5}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.6, 0]}
        />
        {glbUrl && <Avatar3d userId={userId} />}{" "}
        {/* Pass user ID to Avatar3d */}
      </Canvas>
    </div>
  );
};

export default AvatarContainer;
