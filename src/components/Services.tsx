import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   TYPES
========================================================= */

type PartCategory =
  | "foundation"
  | "floor"
  | "structure"
  | "walls"
  | "openings"
  | "roof"
  | "other";

type BuildingPart = {
  mesh: THREE.Mesh;
  name: string;
  category: PartCategory;
  index: number;
  homePosition: THREE.Vector3;
  homeRotation: THREE.Euler;
  center: THREE.Vector3;
  materials: THREE.Material[];
  motionScale: number;
};

/* =========================================================
   MODEL CLASSIFICATION
========================================================= */

function classifyMesh(name: string): PartCategory {
  const normalized = name.toLowerCase();

  // Roof first because roof elements should never be
  // accidentally classified as generic structure.
  if (normalized.includes("roof")) {
    return "roof";
  }

  // Foundation / base
  if (
    normalized === "floor_standardsurface1_0" ||
    normalized === "bot_floor_standardsurface1_0" ||
    normalized.includes("foundation") ||
    normalized.includes("footing") ||
    normalized.includes("ground") ||
    normalized.includes("base")
  ) {
    return "foundation";
  }

  // Doors / windows / glazing
  if (
    normalized.includes("window") ||
    normalized.includes("door") ||
    normalized.includes("glass") ||
    normalized.includes("gar_door")
  ) {
    return "openings";
  }

  // Primary structure
  if (
    normalized.includes("support") ||
    normalized.includes("column") ||
    normalized.includes("beam") ||
    normalized.includes("frame") ||
    normalized.includes("truss") ||
    /^pcube(9|10|11|12|13|14)_/.test(normalized)
  ) {
    return "structure";
  }

  // Envelope
  if (
    normalized.includes("wall") ||
    normalized.includes("partition") ||
    normalized.includes("plaster") ||
    normalized.includes("brick") ||
    normalized.includes("concrete") ||
    normalized.includes("pcube18_") ||
    normalized.includes("pcube19_") ||
    normalized.includes("pcube23_")
  ) {
    return "walls";
  }

  // Floors / slabs
  if (
    normalized.includes("med_floor") ||
    normalized.includes("top_loor") ||
    normalized.includes("floor") ||
    normalized.includes("plat") ||
    normalized.includes("slab")
  ) {
    return "floor";
  }

  return "other";
}

/* =========================================================
   MODEL
========================================================= */

function BuildingModel({
  onReady,
  modelOffsetX,
}: {
  onReady: (parts: BuildingPart[], scale: number) => void;
  modelOffsetX: number;
}) {
  const { scene } = useGLTF("/modern_house.glb");
  const { size } = useThree();

  const normalized = useMemo(() => {
    const clone = scene.clone(true);

    clone.updateMatrixWorld(true);

    const originalBox = new THREE.Box3().setFromObject(clone);

    const originalSize = new THREE.Vector3();
    const originalCenter = new THREE.Vector3();

    originalBox.getSize(originalSize);
    originalBox.getCenter(originalCenter);

    const maxDimension = Math.max(
      originalSize.x,
      originalSize.y,
      originalSize.z
    );

    /*
     * IMPORTANT:
     * Keep the original normalization.
     *
     * The model is normalized to approximately 10 world units.
     * Responsive scaling happens AFTER this.
     */
    const scale = maxDimension > 0 ? 10 / maxDimension : 1;

    clone.scale.setScalar(scale);

    clone.position.set(
      -originalCenter.x * scale,
      -originalCenter.y * scale,
      -originalCenter.z * scale
    );

    clone.updateMatrixWorld(true);

    const parts: BuildingPart[] = [];

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const sourceMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const materials = sourceMaterials.map((material) => {
        const clonedMaterial = material.clone();

        clonedMaterial.transparent = true;
        clonedMaterial.depthWrite = false;

        return clonedMaterial;
      });

      child.material = Array.isArray(child.material)
        ? materials
        : materials[0];

      child.castShadow = true;
      child.receiveShadow = true;

      const worldBox = new THREE.Box3().setFromObject(child);

      const center = worldBox.getCenter(
        new THREE.Vector3()
      );

      parts.push({
        mesh: child,
        name: child.name,
        category: classifyMesh(child.name),
        index: parts.length,
        homePosition: child.position.clone(),
        homeRotation: child.rotation.clone(),
        center,
        materials,
        motionScale: scale,
      });
    });

    return {
      scene: clone,
      parts,
      scale,
    };
  }, [scene]);

  /*
   * Responsive model size.
   *
   * This is intentionally applied AFTER the original
   * normalization. We are NOT replacing the model's
   * original scale calculation.
   */
  const responsiveScale =
    size.width < 480
      ? 0.72
      : size.width < 640
        ? 0.78
        : size.width < 768
          ? 0.84
          : size.width < 1100
            ? 0.92
            : 1;

  /*
   * Give the parent GSAP system the exact parts that
   * are actually being rendered.
   */
  useEffect(() => {
    onReady(normalized.parts, normalized.scale);
  }, [normalized, onReady]);

  return (
    <group
      position={[modelOffsetX, 0, 0]}
      scale={responsiveScale}
    >
      <primitive object={normalized.scene} />
    </group>
  );
}

/* =========================================================
   CAMERA RIG
========================================================= */

function CameraRig({
  cameraRef,
  targetRef,
}: {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  targetRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const { camera, size } = useThree();

  useEffect(() => {
    const perspectiveCamera =
      camera as THREE.PerspectiveCamera;

    perspectiveCamera.fov =
      size.width < 640
        ? 48
        : size.width < 768
          ? 46
          : size.width < 1100
            ? 42
            : 38;

    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame(() => {
    const perspectiveCamera =
      camera as THREE.PerspectiveCamera;

    cameraRef.current = perspectiveCamera;

    /*
     * IMPORTANT FIX:
     *
     * GSAP animates targetRef.current.
     * The camera must actually look at that target.
     */
    perspectiveCamera.lookAt(targetRef.current);
  });

  return null;
}

/* =========================================================
   SERVICE INTRO
========================================================= */

function ServiceIntro() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
      <div className="ml-6 max-w-[520px] md:ml-12 lg:ml-20">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-[#D89A24]" />

          <span className="font-mono text-[9px] tracking-[0.3em] text-[#5F7890]">
            APEX STRUCTURAL / SERVICES
          </span>
        </div>

        <h1 className="text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.84] tracking-[-0.065em] text-[#18324A]">
          THE BUILDING
          <br />
          <span className="text-[#5F7890]">
            IS THE SYSTEM.
          </span>
        </h1>

        <p className="mt-8 max-w-[420px] text-sm leading-7 text-[#5F7890] md:text-base">
          From the ground beneath it to the structure that
          carries it, every building is a sequence of connected
          decisions.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SERVICE COPY
========================================================= */

interface ServiceCopyProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  side: "left" | "right" | "rightUp";
}

const ServiceCopy = forwardRef<
  HTMLDivElement,
  ServiceCopyProps
>(function ServiceCopy(
  {
    number,
    eyebrow,
    title,
    description,
    tags,
    side,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute top-[56%] z-30 w-[min(420px,88vw)] -translate-y-1/2 opacity-0 md:top-1/2 ${
        side === "left"
          ? "left-4 sm:left-6 md:left-12 lg:left-20"
          : "right-4 sm:right-6 md:right-12 lg:right-20"
      }`}
    >
      <div className="relative overflow-hidden border border-[#18324A]/10 border-t-[#D89A24]/60 bg-[#F5F3EE]/75 p-5 pt-4 shadow-[0_24px_70px_rgba(24,50,74,0.08)] backdrop-blur-[8px] sm:p-6 sm:pt-4">
        {/* Technical corner */}
        <div className="absolute right-0 top-0 h-px w-20 bg-[#D89A24]/70" />
        <div className="absolute right-0 top-0 h-5 w-px bg-[#D89A24]/30" />

        {/* Small left technical marker */}
        <div className="absolute bottom-0 left-0 h-8 w-px bg-[#18324A]/10" />

        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#D89A24]">
              {number}
            </span>

            <p className="mt-2 font-mono text-[9px] tracking-[0.22em] text-[#5F7890]">
              {eyebrow}
            </p>
          </div>

          <span className="font-mono text-[8px] tracking-wider text-[#A6B4BE]">
            APEX / SYSTEM
          </span>
        </div>

        <h2 className="mt-5 text-[clamp(2.2rem,7vw,5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#18324A]">
          {title}
        </h2>

        <p className="mt-6 max-w-[360px] text-[13px] leading-6 text-[#5F7890] sm:text-sm sm:leading-7">
          {description}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`border border-[#18324A]/15 px-3 py-2 font-mono text-[8px] tracking-[0.15em] ${
                side === "rightUp"
                  ? "text-[#5F7890]"
                  : "text-[#18324A]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

/* =========================================================
   INTERIOR LABEL
========================================================= */

const InteriorLabel = forwardRef<HTMLDivElement>(function InteriorLabel(_, ref) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute top-[56%] right-4 z-30 w-[min(420px,88vw)] -translate-y-1/2 p-0 opacity-0 sm:right-6 md:top-1/2 md:right-12 lg:right-20"
    >
      <div className="relative overflow-hidden border border-[#18324A]/10 border-t-[#D89A24]/60 bg-[#F5F3EE]/75 p-5 pt-4 shadow-[0_24px_70px_rgba(24,50,74,0.08)] backdrop-blur-[8px] sm:p-6 sm:pt-4">
        {/* Technical corner */}
        <div className="absolute right-0 top-0 h-px w-20 bg-[#D89A24]/70" />
        <div className="absolute right-0 top-0 h-5 w-px bg-[#D89A24]/30" />

        {/* Small left technical marker */}
        <div className="absolute bottom-0 left-0 h-8 w-px bg-[#18324A]/10" />

        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#D89A24]">
              04.5
            </span>

            <p className="mt-2 font-mono text-[9px] tracking-[0.22em] text-[#5F7890]">
              INTERNAL LOAD PATH
            </p>
          </div>

          <span className="font-mono text-[8px] tracking-wider text-[#A6B4BE]">
            APEX / SYSTEM
          </span>
        </div>

        <h2 className="mt-5 text-[clamp(2.2rem,7vw,5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#18324A]">
          INSIDE
          <br />
          THE SYSTEM.
        </h2>

        <p className="mt-6 max-w-[360px] text-[13px] leading-6 text-[#5F7890] sm:text-sm sm:leading-7">
          Remove the envelope and the logic becomes visible. Slabs, supports
          and load paths work together as one continuous structural system.
        </p>

        <div className="mt-7 flex items-center gap-3">
          <span className="h-px w-12 bg-[#D89A24]" />

          <span className="font-mono text-[8px] tracking-[0.18em] text-[#18324A]">
            LOAD PATH / ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
});

/* =========================================================
   FINAL STATEMENT
========================================================= */

const FinalStatement = forwardRef<HTMLDivElement>(
  function FinalStatement(_, ref) {
    return (
      <div
        ref={ref}
        className="pointer-events-none absolute inset-0 top-[-300px] z-30 flex items-center justify-center px-6 text-center opacity-0"
      >
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#D89A24]">
            APEX STRUCTURAL
          </p>

          <h2 className="mt-6 max-w-[900px] text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-[#18324A]">
            ENGINEERED
            <br />
            AS ONE SYSTEM.
          </h2>

          <p className="mx-auto mt-7 max-w-[420px] text-sm leading-7 text-[#5F7890]">
            Every element has a role. Every load has a path.
            Every decision contributes to the whole.
          </p>
        </div>
      </div>
    );
  }
);

/* =========================================================
   TECHNICAL OVERLAY
========================================================= */

function TechnicalOverlay({
  progressRef,
}: {
  progressRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(#18324A 1px, transparent 1px),
            linear-gradient(90deg, #18324A 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* TOP RIGHT */}
      <div className="absolute right-5 top-5 text-right sm:right-6 sm:top-6 md:right-12">
        <p className="font-mono text-[7px] tracking-[0.25em] text-[#5F7890] sm:text-[8px]">
          STRUCTURAL DECONSTRUCTION
        </p>

        <p className="mt-2 font-mono text-[8px] tracking-wider text-[#18324A] sm:text-[9px]">
          SYSTEM / 01
        </p>
      </div>

      {/* CENTER CROSSHAIR */}
      <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <span className="absolute left-1/2 top-0 h-full w-px bg-[#18324A]" />

        <span className="absolute left-0 top-1/2 h-px w-full bg-[#18324A]" />

        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D89A24]" />
      </div>

      {/* TOP LEFT COORDINATES */}
      <div className="absolute left-6 top-6 hidden md:left-12 md:block">
        <p className="font-mono text-[8px] tracking-wider text-[#A6B4BE]">
          X 024.018
        </p>

        <p className="mt-1 font-mono text-[8px] tracking-wider text-[#A6B4BE]">
          Y 018.204
        </p>

        <p className="mt-1 font-mono text-[8px] tracking-wider text-[#A6B4BE]">
          Z 006.812
        </p>
      </div>

      {/* LEFT SCALE */}
      <div className="absolute bottom-10 left-6 hidden md:left-12 md:block">
        <div className="flex items-center gap-3">
          <span className="h-px w-16 bg-[#18324A]/30" />

          <span className="font-mono text-[8px] tracking-wider text-[#5F7890]">
            2400 MM
          </span>
        </div>
      </div>

      {/* BOTTOM PROGRESS */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#18324A]/10">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-[#D89A24]"
        />
      </div>

      {/* BOTTOM CENTER */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-4 md:flex">
        <span className="font-mono text-[8px] tracking-[0.2em] text-[#5F7890]">
          SCROLL TO DECONSTRUCT
        </span>

        <span className="h-px w-12 bg-[#18324A]/20" />

        <span className="font-mono text-[8px] tracking-[0.2em] text-[#18324A]">
          01 — 05
        </span>
      </div>

      {/* MOBILE SCROLL LABEL */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 md:hidden">
        <span className="h-px w-8 bg-[#18324A]/20" />

        <span className="font-mono text-[7px] tracking-[0.2em] text-[#5F7890]">
          SCROLL
        </span>

        <span className="h-px w-8 bg-[#18324A]/20" />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SERVICES PAGE
========================================================= */

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const modelRootRef = useRef<THREE.Group | null>(null);

  const cameraRef =
    useRef<THREE.PerspectiveCamera | null>(null);

  const cameraTargetRef = useRef(
    new THREE.Vector3(2.2, 4, 0)
  );

  const partsRef = useRef<BuildingPart[]>([]);

  const modelScaleRef = useRef(1);

  const introRef = useRef<HTMLDivElement | null>(null);

  const service01Ref = useRef<HTMLDivElement | null>(null);
  const service02Ref = useRef<HTMLDivElement | null>(null);
  const service03Ref = useRef<HTMLDivElement | null>(null);
  const service04Ref = useRef<HTMLDivElement | null>(null);
  const service05Ref = useRef<HTMLDivElement | null>(null);

  const interiorRef = useRef<HTMLDivElement | null>(null);

  const finalRef = useRef<HTMLDivElement | null>(null);

  const progressRef = useRef<HTMLDivElement | null>(null);

  const [modelReady, setModelReady] = useState(false);

  /*
   * Use a reactive media-query style check instead of
   * reading window.innerWidth once during render.
   */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  /*
   * Desktop:
   * model sits slightly right to make room for copy.
   *
   * Mobile:
   * center it.
   */
  const modelOffsetX = isMobile ? 0 : 2.2;

  const handleModelReady = useCallback(
    (parts: BuildingPart[], scale: number) => {
      partsRef.current = parts;
      modelScaleRef.current = scale;
      setModelReady(true);
    },
    []
  );

  /* =======================================================
     GSAP STORY
  ======================================================= */

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (!modelReady) return;
      if (!cameraRef.current) return;
      if (!partsRef.current.length) return;

      const section = sectionRef.current;
      const camera = cameraRef.current;
      const parts = partsRef.current;
      const modelRoot = modelRootRef.current;

      if (!modelRoot) return;

      const motionScale = modelScaleRef.current;

      const categories: PartCategory[] = [
        "foundation",
        "floor",
        "structure",
        "walls",
        "openings",
        "roof",
        "other",
      ];

      /* =====================================================
         MATERIAL HELPERS
      ===================================================== */

      const categoryMaterials =
        new Map<PartCategory, THREE.Material[]>();

      categories.forEach((category) => {
        const materials = parts
          .filter((part) => part.category === category)
          .flatMap((part) => part.materials);

        categoryMaterials.set(category, materials);
      });

      const allMaterials = Array.from(
        new Set(
          parts.flatMap((part) => part.materials)
        )
      );

      const baseColors = new Map<
        THREE.Material,
        THREE.Color
      >();

      allMaterials.forEach((material) => {
        const colorMaterial =
          material as THREE.Material & {
            color?: THREE.Color;
          };

        if (
          colorMaterial.color instanceof THREE.Color
        ) {
          baseColors.set(
            material,
            colorMaterial.color.clone()
          );
        }
      });

      const amber = new THREE.Color("#D89A24");

      const getMaterials = (
        category: PartCategory
      ) => {
        return categoryMaterials.get(category) ?? [];
      };

      const fadeCategory = (
        timeline: gsap.core.Timeline,
        category: PartCategory,
        opacity: number,
        position: number | string,
        duration = 0.65
      ) => {
        const materials = getMaterials(category);

        if (!materials.length) return;

        timeline.to(
          materials,
          {
            opacity,
            duration,
            ease: "power2.out",
          },
          position
        );
      };

      const highlightCategory = (
        timeline: gsap.core.Timeline,
        category: PartCategory,
        position: number | string,
        duration = 0.5
      ) => {
        const materials = getMaterials(category);

        materials.forEach((material) => {
          const colorMaterial =
            material as THREE.Material & {
              color?: THREE.Color;
            };

          if (
            !(colorMaterial.color instanceof THREE.Color)
          ) {
            return;
          }

          timeline.to(
            colorMaterial.color,
            {
              r: amber.r,
              g: amber.g,
              b: amber.b,
              duration,
              ease: "power2.out",
            },
            position
          );
        });
      };

      const restoreColors = (
        timeline: gsap.core.Timeline,
        position: number | string
      ) => {
        baseColors.forEach((color, material) => {
          const colorMaterial =
            material as THREE.Material & {
              color?: THREE.Color;
            };

          if (
            !(colorMaterial.color instanceof THREE.Color)
          ) {
            return;
          }

          timeline.to(
            colorMaterial.color,
            {
              r: color.r,
              g: color.g,
              b: color.b,
              duration: 0.7,
              ease: "power2.out",
            },
            position
          );
        });
      };

      const fadeEverythingExcept = (
        timeline: gsap.core.Timeline,
        keep: PartCategory,
        opacity: number,
        position: number | string
      ) => {
        categories.forEach((category) => {
          if (category === keep) return;

          fadeCategory(
            timeline,
            category,
            opacity,
            position
          );
        });
      };

      const restoreAllOpacity = (
        timeline: gsap.core.Timeline,
        position: number | string
      ) => {
        categories.forEach((category) => {
          fadeCategory(
            timeline,
            category,
            1,
            position,
            0.75
          );
        });
      };

      /* =====================================================
         PART MOVEMENT
      ===================================================== */

      const movePart = (
        timeline: gsap.core.Timeline,
        part: BuildingPart,
        offset: THREE.Vector3,
        position: number | string,
        duration = 1
      ) => {
        timeline.to(
          part.mesh.position,
          {
            x:
              part.homePosition.x +
              offset.x / motionScale,

            y:
              part.homePosition.y +
              offset.y / motionScale,

            z:
              part.homePosition.z +
              offset.z / motionScale,

            duration,
            ease: "power3.inOut",
          },
          position
        );
      };

      const moveCategory = (
        timeline: gsap.core.Timeline,
        category: PartCategory,
        getOffset: (
          part: BuildingPart
        ) => THREE.Vector3,
        position: number | string,
        duration = 1
      ) => {
        parts
          .filter(
            (part) => part.category === category
          )
          .forEach((part) => {
            movePart(
              timeline,
              part,
              getOffset(part),
              position,
              duration
            );
          });
      };

      const resetCategoryPosition = (
        timeline: gsap.core.Timeline,
        category: PartCategory,
        position: number | string,
        duration = 0.9
      ) => {
        parts
          .filter(
            (part) => part.category === category
          )
          .forEach((part) => {
            timeline.to(
              part.mesh.position,
              {
                x: part.homePosition.x,
                y: part.homePosition.y,
                z: part.homePosition.z,
                duration,
                ease: "power3.inOut",
              },
              position
            );
          });
      };

      const resetAllPositions = (
        timeline: gsap.core.Timeline,
        position: number | string
      ) => {
        parts.forEach((part) => {
          timeline.to(
            part.mesh.position,
            {
              x: part.homePosition.x,
              y: part.homePosition.y,
              z: part.homePosition.z,
              duration: 0.9,
              ease: "power3.inOut",
            },
            position
          );

          timeline.to(
            part.mesh.rotation,
            {
              x: part.homeRotation.x,
              y: part.homeRotation.y,
              z: part.homeRotation.z,
              duration: 0.9,
              ease: "power3.inOut",
            },
            position
          );
        });
      };

      /* =====================================================
         CAMERA
      ===================================================== */

      const moveCamera = (
        timeline: gsap.core.Timeline,
        position: THREE.Vector3,
        target: THREE.Vector3,
        at: number | string,
        duration = 1.2,
        fov?: number
      ) => {
        timeline.to(
          camera.position,
          {
            x: position.x,
            y: position.y,
            z: position.z,
            duration,
            ease: "power3.inOut",
          },
          at
        );

        timeline.to(
          cameraTargetRef.current,
          {
            x: target.x,
            y: target.y,
            z: target.z,
            duration,
            ease: "power3.inOut",
          },
          at
        );

        if (typeof fov === "number") {
          timeline.to(
            camera,
            {
              fov,
              duration,
              ease: "power3.inOut",
              onUpdate: () => {
                camera.updateProjectionMatrix();
              },
            },
            at
          );
        }
      };

      /* =====================================================
         INITIAL STATE
      ===================================================== */

      allMaterials.forEach((material) => {
        material.transparent = true;
        material.depthWrite = false;
      });

      gsap.set(allMaterials, {
        opacity: 0,
      });

      gsap.set(modelRoot.scale, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
      });

      gsap.set(modelRoot.rotation, {
        y: -0.08,
      });

      gsap.set(
        [
          service01Ref.current,
          service02Ref.current,
          service03Ref.current,
          service04Ref.current,
          service05Ref.current,
          interiorRef.current,
          finalRef.current,
        ],
        {
          opacity: 0,
        }
      );

      parts.forEach((part) => {
        part.mesh.position.copy(
          part.homePosition
        );

        part.mesh.rotation.copy(
          part.homeRotation
        );
      });

      /*
       * Reset camera state explicitly.
       * This makes re-entry / refresh much more reliable.
       */
      camera.position.set(
        15,
        10,
        22
      );

      cameraTargetRef.current.set(
        modelOffsetX,
        3.5,
        0
      );

      camera.lookAt(
        cameraTargetRef.current
      );

      /* =====================================================
         MASTER TIMELINE
      ===================================================== */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=750%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: false,
        },
      });

      /* =====================================================
         00 — BUILDING ARRIVES
      ===================================================== */

      tl.to(
        allMaterials,
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        modelRoot.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          ease: "power3.out",
        },
        0
      );

      tl.to(
        modelRoot.rotation,
        {
          y: 0,
          duration: 1.5,
          ease: "power3.out",
        },
        0
      );

      tl.to(
        introRef.current,
        {
          opacity: 0,
          y: -35,
          duration: 0.8,
          ease: "power3.inOut",
        },
        1.35
      );

      /* =====================================================
         01 — FOUNDATION
      ===================================================== */

      fadeEverythingExcept(
        tl,
        "foundation",
        0.1,
        1.65
      );

      highlightCategory(
        tl,
        "foundation",
        1.75
      );

      moveCategory(
        tl,
        "foundation",
        () =>
          new THREE.Vector3(
            0,
            -1.5,
            0
          ),
        1.7,
        1.1
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          isMobile ? 8 : 10,
          1.8,
          -12
        ),
        new THREE.Vector3(
          modelOffsetX,
          -2.5,
          0
        ),
        1.55,
        1.25,
        isMobile ? 42 : 39
      );

      tl.to(
        service01Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        2
      );

      /* =====================================================
         02 — STRUCTURAL FRAME
      ===================================================== */

      tl.to(
        service01Ref.current,
        {
          opacity: 0,
          y: -25,
          duration: 0.5,
        },
        3.0
      );

      resetCategoryPosition(
        tl,
        "foundation",
        3.0
      );

      fadeCategory(
        tl,
        "foundation",
        0.2,
        3.05
      );

      fadeCategory(
        tl,
        "structure",
        1,
        3.05
      );

      fadeCategory(
        tl,
        "floor",
        0.08,
        3.05
      );

      fadeCategory(
        tl,
        "walls",
        0.08,
        3.05
      );

      fadeCategory(
        tl,
        "openings",
        0.06,
        3.05
      );

      fadeCategory(
        tl,
        "roof",
        0.08,
        3.05
      );

      highlightCategory(
        tl,
        "structure",
        3.2
      );

      moveCategory(
        tl,
        "structure",
        (part) => {
          const xDirection =
            part.center.x >= 0 ? 1 : -1;

          const zDirection =
            part.center.z >= 0 ? 1 : -1;

          return new THREE.Vector3(
            xDirection * 0.45,
            0.15,
            zDirection * 0.25
          );
        },
        3.15,
        1.1
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          isMobile ? 10 : 12,
          5.5,
          -14
        ),
        new THREE.Vector3(
          modelOffsetX,
          0.5,
          0
        ),
        3.1,
        1.3,
        isMobile ? 40 : 37
      );

      tl.to(
        service02Ref.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        3.45
      );

      /* =====================================================
         03 — FLOORS / SLABS
      ===================================================== */

      tl.to(
        service02Ref.current,
        {
          opacity: 0,
          x: -20,
          duration: 0.5,
        },
        4.65
      );

      resetCategoryPosition(
        tl,
        "structure",
        4.7
      );

      fadeCategory(
        tl,
        "structure",
        0.3,
        4.7
      );

      fadeCategory(
        tl,
        "foundation",
        0.18,
        4.7
      );

      fadeCategory(
        tl,
        "floor",
        1,
        4.7
      );

      fadeCategory(
        tl,
        "walls",
        0.05,
        4.7
      );

      fadeCategory(
        tl,
        "openings",
        0.05,
        4.7
      );

      fadeCategory(
        tl,
        "roof",
        0.08,
        4.7
      );

      highlightCategory(
        tl,
        "floor",
        4.85
      );

      moveCategory(
        tl,
        "floor",
        (part) => {
          const name =
            part.name.toLowerCase();

          if (
            name.includes("top_loor")
          ) {
            return new THREE.Vector3(
              0,
              1.35,
              0
            );
          }

          if (
            name.includes("med_floor")
          ) {
            return new THREE.Vector3(
              0,
              0.25,
              0
            );
          }

          if (
            name.includes("plat")
          ) {
            return new THREE.Vector3(
              0,
              -0.7,
              0
            );
          }

          return new THREE.Vector3(
            0,
            -0.45,
            0
          );
        },
        4.8,
        1.15
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          isMobile ? 10 : 13,
          7.5,
          -15
        ),
        new THREE.Vector3(
          modelOffsetX,
          2.3,
          0
        ),
        4.7,
        1.35,
        isMobile ? 39 : 36
      );

      tl.to(
        service03Ref.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        5.05
      );

      /* =====================================================
         04 — ENVELOPE
      ===================================================== */

      tl.to(
        service03Ref.current,
        {
          opacity: 0,
          y: -25,
          duration: 0.5,
        },
        6.05
      );

      resetCategoryPosition(
        tl,
        "floor",
        6.05
      );

      fadeCategory(
        tl,
        "floor",
        0.25,
        6.05
      );

      fadeCategory(
        tl,
        "structure",
        0.35,
        6.05
      );

      fadeCategory(
        tl,
        "foundation",
        0.12,
        6.05
      );

      fadeCategory(
        tl,
        "roof",
        0.2,
        6.05
      );

      fadeCategory(
        tl,
        "walls",
        1,
        6.2
      );

      fadeCategory(
        tl,
        "openings",
        0.95,
        6.2
      );

      moveCategory(
        tl,
        "walls",
        (part) => {
          const x =
            part.center.x >= 0
              ? 0.7
              : -0.7;

          const z =
            part.center.z >= 0
              ? 0.35
              : -0.35;

          return new THREE.Vector3(
            x,
            0.2,
            z
          );
        },
        6.15,
        0
      );

      resetCategoryPosition(
        tl,
        "walls",
        6.2,
        1.05
      );

      moveCategory(
        tl,
        "openings",
        (part) => {
          const z =
            part.center.z >= 0
              ? 0.45
              : -0.45;

          return new THREE.Vector3(
            0,
            0,
            z
          );
        },
        6.2,
        0
      );

      resetCategoryPosition(
        tl,
        "openings",
        6.25,
        1
      );

      highlightCategory(
        tl,
        "walls",
        6.45
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          isMobile ? 8 : 10,
          5,
          -12
        ),
        new THREE.Vector3(
          modelOffsetX,
          3.5,
          0
        ),
        6.1,
        1.35,
        isMobile ? 38 : 35
      );

      tl.to(
        service04Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        6.55
      );

      /* =====================================================
         04.5 — ENTER THE BUILDING
      ===================================================== */

      tl.to(
        service04Ref.current,
        {
          opacity: 0,
          duration: 0.45,
        },
        7.55
      );

      fadeCategory(
        tl,
        "walls",
        0.03,
        7.55
      );

      fadeCategory(
        tl,
        "openings",
        0.06,
        7.55
      );

      fadeCategory(
        tl,
        "roof",
        0.08,
        7.55
      );

      fadeCategory(
        tl,
        "floor",
        0.28,
        7.55
      );

      fadeCategory(
        tl,
        "foundation",
        0.12,
        7.55
      );

      fadeCategory(
        tl,
        "structure",
        1,
        7.55
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          modelOffsetX,
          4.2,
          -8
        ),
        new THREE.Vector3(
          modelOffsetX,
          4.2,
          -1
        ),
        7.55,
        1.15,
        isMobile ? 34 : 31
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          modelOffsetX,
          3.9,
          -3.8
        ),
        new THREE.Vector3(
          modelOffsetX,
          4,
          1.8
        ),
        8.45,
        1.2,
        isMobile ? 33 : 30
      );

      tl.to(
        interiorRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        8.8
      );

      tl.to(
        modelRoot.rotation,
        {
          y: 0.06,
          duration: 1.1,
          ease: "power2.inOut",
        },
        8.6
      );

      /* =====================================================
         05 — ROOF
      ===================================================== */

      tl.to(
        interiorRef.current,
        {
          opacity: 0,
          x: 25,
          duration: 0.5,
        },
        9.75
      );

      fadeCategory(
        tl,
        "structure",
        0.4,
        9.75
      );

      fadeCategory(
        tl,
        "floor",
        0.25,
        9.75
      );

      fadeCategory(
        tl,
        "walls",
        0.08,
        9.75
      );

      fadeCategory(
        tl,
        "openings",
        0.1,
        9.75
      );

      fadeCategory(
        tl,
        "roof",
        1,
        9.75
      );

      highlightCategory(
        tl,
        "roof",
        9.9
      );

      moveCategory(
        tl,
        "roof",
        () =>
          new THREE.Vector3(
            0,
            1.5,
            0
          ),
        9.85,
        1.1
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          isMobile ? 8 : 11,
          10,
          -12
        ),
        new THREE.Vector3(
          modelOffsetX,
          5.5,
          0
        ),
        9.7,
        1.35,
        isMobile ? 38 : 35
      );

      tl.to(
        service05Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        10.15
      );

      /* =====================================================
         06 — RECONSTRUCTION
      ===================================================== */

      tl.to(
        service05Ref.current,
        {
          opacity: 0,
          y: -25,
          duration: 0.5,
        },
        11.05
      );

      resetCategoryPosition(
        tl,
        "roof",
        11.05
      );

      restoreAllOpacity(
        tl,
        11.15
      );

      restoreColors(
        tl,
        11.15
      );

      resetAllPositions(
        tl,
        11.2
      );

      tl.to(
        modelRoot.rotation,
        {
          y: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        11.25
      );

      moveCamera(
        tl,
        new THREE.Vector3(
          isMobile ? 0 : 14,
          8.5,
          -20
        ),
        new THREE.Vector3(
          modelOffsetX,
          3.8,
          0
        ),
        11.15,
        1.6,
        isMobile ? 40 : 37
      );

      tl.to(
        finalRef.current,
        {
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        11.8
      );

      /* =====================================================
         PROGRESS
      ===================================================== */

      if (progressRef.current) {
        tl.to(
          progressRef.current,
          {
            scaleX: 1,
            duration: 12.5,
            ease: "none",
          },
          0
        );
      }

      /*
       * Refresh only after the browser has had time to lay out
       * the pinned section and Canvas.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    {
      scope: sectionRef,
      dependencies: [
        modelReady,
        isMobile,
        modelOffsetX,
      ],
      revertOnUpdate: true,
    }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#F5F3EE]"
    >
      {/* =====================================================
          3D SCENE
      ===================================================== */}

      <div className="absolute inset-0 z-[1]">
        <Canvas
          camera={{
            position: [15, 10, 22],
            fov: 38,
            near: 0.01,
            far: 1000,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
          }}
        >
          <CameraRig
            cameraRef={cameraRef}
            targetRef={cameraTargetRef}
          />

          {/* LIGHTING */}

          <ambientLight intensity={2.1} />

          <directionalLight
            position={[10, 20, -10]}
            intensity={4}
          />

          <directionalLight
            position={[-12, 10, 8]}
            intensity={2}
          />

          <directionalLight
            position={[0, -5, -15]}
            intensity={1}
          />

          <hemisphereLight
            args={[
              "#FFFFFF",
              "#18324A",
              1.5,
            ]}
          />

          {/* MODEL */}

          <group ref={modelRootRef}>
            <BuildingModel
              onReady={handleModelReady}
              modelOffsetX={modelOffsetX}
            />
          </group>
        </Canvas>
      </div>

      {/* =====================================================
          TECHNICAL UI
      ===================================================== */}

      <TechnicalOverlay
        progressRef={progressRef}
      />

      {/* =====================================================
          INTRO
      ===================================================== */}

      <div
        ref={introRef}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <ServiceIntro />
      </div>

      {/* =====================================================
          FOUNDATION
      ===================================================== */}

      <ServiceCopy
        ref={service01Ref}
        number="01"
        eyebrow="GROUND / LOAD TRANSFER"
        title="Foundation"
        description="Every structure begins with the system beneath it. We engineer foundations to transfer loads safely into the ground while accounting for site conditions, structural demands and long-term performance."
        tags={[
          "LOAD PATH",
          "FOOTINGS",
          "GROUND SYSTEM",
        ]}
        side="left"
      />

      {/* =====================================================
          STRUCTURE
      ===================================================== */}

      <ServiceCopy
        ref={service02Ref}
        number="02"
        eyebrow="PRIMARY STRUCTURE"
        title="Structural Frame"
        description="Columns, beams and supporting members form the primary load-bearing system. Our structural approach turns architectural intent into a stable, efficient and buildable frame."
        tags={[
          "COLUMNS",
          "BEAMS",
          "LOAD TRANSFER",
        ]}
        side="right"
      />

      {/* =====================================================
          FLOORS
      ===================================================== */}

      <ServiceCopy
        ref={service03Ref}
        number="03"
        eyebrow="HORIZONTAL SYSTEMS"
        title="Floors & Slabs"
        description="Horizontal structural elements distribute loads across the frame while creating usable levels within the building. Precision here keeps the entire system aligned."
        tags={[
          "SLABS",
          "LEVELS",
          "DISTRIBUTION",
        ]}
        side="left"
      />

      {/* =====================================================
          ENVELOPE
      ===================================================== */}

      <ServiceCopy
        ref={service04Ref}
        number="04"
        eyebrow="BUILDING ENVELOPE"
        title="Envelope"
        description="Walls, openings and external elements define the building's boundary. We coordinate structural requirements with the envelope so performance and architectural expression work together."
        tags={[
          "WALLS",
          "OPENINGS",
          "COORDINATION",
        ]}
        side="rightUp"
      />

      {/* =====================================================
          INTERIOR
      ===================================================== */}

      <InteriorLabel ref={interiorRef} />

      {/* =====================================================
          ROOF
      ===================================================== */}

      <ServiceCopy
        ref={service05Ref}
        number="05"
        eyebrow="TOP OF STRUCTURE"
        title="Roof Systems"
        description="The final structural layer closes the system. Roof members are coordinated for stability, load distribution and integration with the completed building."
        tags={[
          "ROOF",
          "TRUSSES",
          "STABILITY",
        ]}
        side="left"
      />

      {/* =====================================================
          FINAL
      ===================================================== */}

      <FinalStatement ref={finalRef} />
    </section>
  );
}

useGLTF.preload("/modern_house.glb");