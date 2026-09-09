import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

type MeshInfo = {
  index: number;
  name: string;
  uuid: string;
  mesh: THREE.Mesh;
};

interface BuildingProps {
  selected: number | null;
  hidden: Set<number>;
  meshes: MeshInfo[];
}

function BuildingModel({
  selected,
  hidden,
  meshes,
}: BuildingProps) {
  return (
    <Center>
      <group>
        {meshes.map((item) => {
          const original = item.mesh;
          const clone = original.clone();

          if (original.material instanceof THREE.Material) {
            clone.material = original.material.clone();

            clone.material.transparent = true;

            const isSelected = selected === item.index;
            const isHidden = hidden.has(item.index);
            const hasSelection = selected !== null;

            clone.material.opacity = isHidden
              ? 0
              : hasSelection && !isSelected
                ? 0.12
                : 1;

            if (
              isSelected &&
              clone.material instanceof THREE.MeshStandardMaterial
            ) {
              clone.material.color.set("#D89A24");
              clone.material.emissive.set("#D89A24");
              clone.material.emissiveIntensity = 0.25;
            }
          }

          return (
            <primitive
              key={item.uuid}
              object={clone}
            />
          );
        })}
      </group>
    </Center>
  );
}

function ModelData({
  setMeshes,
}: {
  setMeshes: React.Dispatch<React.SetStateAction<MeshInfo[]>>;
}) {
  const { scene } = useGLTF("/modern_house.glb");

  const meshes = useMemo<MeshInfo[]>(() => {
    const result: MeshInfo[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        result.push({
          index: result.length,
          name: child.name || "UNNAMED",
          uuid: child.uuid,
          mesh: child,
        });
      }
    });

    return result;
  }, [scene]);

  useEffect(() => {
    setMeshes(meshes);
  }, [meshes, setMeshes]);

  return null;
}

export default function ModelInspector() {
  const [meshes, setMeshes] = useState<MeshInfo[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hidden, setHidden] = useState<Set<number>>(new Set());

  const selectedMesh =
    selected !== null ? meshes[selected] : null;

  const toggleHidden = (index: number) => {
    setHidden((previous) => {
      const next = new Set(previous);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const hideAllExcept = (index: number) => {
    const next = new Set<number>();

    meshes.forEach((mesh) => {
      if (mesh.index !== index) {
        next.add(mesh.index);
      }
    });

    setHidden(next);
    setSelected(index);
  };

  const showEverything = () => {
    setHidden(new Set());
    setSelected(null);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F5F3EE]">

      {/* Hidden GLB loader */}
      <ModelData setMeshes={setMeshes} />

      {/* 3D VIEW */}
      <Canvas
        camera={{
          position: [35, 25, 45],
          fov: 45,
        }}
        gl={{
          antialias: true,
        }}
      >
        <color
          attach="background"
          args={["#F5F3EE"]}
        />

        <ambientLight intensity={2} />

        <directionalLight
          position={[20, 30, 20]}
          intensity={4}
        />

        <directionalLight
          position={[-20, 10, -20]}
          intensity={2}
        />

        <BuildingModel
          selected={selected}
          hidden={hidden}
          meshes={meshes}
        />

        <gridHelper
          args={[
            100,
            50,
            "#18324A",
            "#D9D6CE",
          ]}
          position={[0, -0.5, 0]}
        />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* HEADER */}
      <div className="absolute left-6 top-6 z-10">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#5F7890]">
          APEX STRUCTURAL
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#18324A]">
          MODEL INSPECTOR
        </h1>

        <p className="mt-2 font-mono text-[9px] tracking-wider text-[#5F7890]">
          {meshes.length} MESH COMPONENTS
        </p>
      </div>

      {/* COMPONENT PANEL */}
      <div className="absolute right-4 top-4 z-20 flex max-h-[calc(100vh-32px)] w-[340px] flex-col border border-[#D9D6CE] bg-white/95 shadow-xl backdrop-blur-md">

        {/* PANEL HEADER */}
        <div className="flex items-center justify-between border-b border-[#D9D6CE] px-4 py-3">
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-[#5F7890]">
              SCENE COMPONENTS
            </p>

            <p className="mt-1 text-sm font-medium text-[#18324A]">
              {meshes.length} meshes detected
            </p>
          </div>

          <button
            type="button"
            onClick={showEverything}
            className="border border-[#18324A] px-3 py-1.5 font-mono text-[9px] tracking-wider text-[#18324A] transition-colors hover:bg-[#18324A] hover:text-white"
          >
            RESET
          </button>
        </div>

        {/* LIST */}
        <div className="overflow-y-auto p-2">

          {meshes.map((item) => {
            const isSelected =
              selected === item.index;

            const isHidden =
              hidden.has(item.index);

            return (
              <div
                key={item.uuid}
                className={`mb-1 flex items-center gap-2 border transition-colors ${
                  isSelected
                    ? "border-[#D89A24] bg-[#FFF8E8]"
                    : "border-transparent hover:border-[#D9D6CE]"
                }`}
              >

                {/* SELECT */}
                <button
                  type="button"
                  onClick={() =>
                    setSelected(item.index)
                  }
                  className="min-w-0 flex-1 px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2">

                    <span
                      className={`font-mono text-[10px] ${
                        isSelected
                          ? "text-[#D89A24]"
                          : "text-[#5F7890]"
                      }`}
                    >
                      {String(item.index + 1).padStart(2, "0")}
                    </span>

                    <span className="truncate font-mono text-[10px] text-[#18324A]">
                      {item.name}
                    </span>

                  </div>
                </button>

                {/* ISOLATE */}
                <button
                  type="button"
                  onClick={() =>
                    hideAllExcept(item.index)
                  }
                  title="Isolate"
                  className="px-2 font-mono text-[9px] text-[#5F7890] hover:text-[#D89A24]"
                >
                  ISO
                </button>

                {/* HIDE */}
                <button
                  type="button"
                  onClick={() =>
                    toggleHidden(item.index)
                  }
                  title="Hide/show"
                  className={`px-2 font-mono text-[9px] ${
                    isHidden
                      ? "text-[#D89A24]"
                      : "text-[#5F7890]"
                  }`}
                >
                  {isHidden ? "SHOW" : "HIDE"}
                </button>

              </div>
            );
          })}

        </div>
      </div>

      {/* SELECTED INFORMATION */}
      {selectedMesh && (
        <div className="absolute bottom-6 left-6 z-20 w-[300px] border border-[#18324A] bg-[#18324A] p-5 text-white shadow-xl">

          <div className="flex items-center justify-between">

            <p className="font-mono text-[9px] tracking-[0.25em] text-[#D89A24]">
              SELECTED MESH
            </p>

            <span className="font-mono text-[10px] text-[#AFC0CE]">
              {String(selectedMesh.index + 1).padStart(2, "0")}
            </span>

          </div>

          <h2 className="mt-2 break-all text-sm font-medium">
            {selectedMesh.name}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div>
              <p className="font-mono text-[8px] tracking-wider text-[#AFC0CE]">
                TYPE
              </p>

              <p className="mt-1 font-mono text-[10px]">
                THREE.MESH
              </p>
            </div>

            <div>
              <p className="font-mono text-[8px] tracking-wider text-[#AFC0CE]">
                MATERIAL
              </p>

              <p className="mt-1 font-mono text-[10px]">
                {selectedMesh.mesh.material instanceof
                THREE.Material
                  ? selectedMesh.mesh.material.name ||
                    "UNNAMED"
                  : "MULTI"}
              </p>
            </div>

          </div>

          <p className="mt-4 break-all font-mono text-[8px] text-[#71899D]">
            {selectedMesh.uuid}
          </p>

        </div>
      )}

      {/* INSTRUCTIONS */}
      <div className="absolute bottom-6 right-[370px] z-10 font-mono text-[9px] tracking-[0.15em] text-[#5F7890]">
        DRAG · ROTATE · ZOOM · INSPECT
      </div>

    </div>
  );
}

useGLTF.preload("/modern_house.glb");