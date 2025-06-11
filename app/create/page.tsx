"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dice5, Plus, Check, X, Upload, Download, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Character {
  id: string;
  name: string;
  imageSrc: string;
  gender: "male" | "female";
}

interface RecentChat {
  id: string;
  name: string;
  imageSrc: string;
  gender: "male" | "female";
}

export default function CreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Character and selection states
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );
  const [selectedStyle, setSelectedStyle] = useState<"realistic" | "anime">(
    "realistic"
  );
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);

  // Mock data - Recent chats
  useEffect(() => {
    // Simulating fetching recent chat characters
    setRecentChats([
      {
        id: "ethan",
        name: "Ethan",
        imageSrc: "/placeholder.svg?height=80&width=80&text=E",
        gender: "male",
      },
      {
        id: "olivia",
        name: "Olivia",
        imageSrc: "/placeholder.svg?height=80&width=80&text=O",
        gender: "female",
      },
      {
        id: "alex",
        name: "Alex",
        imageSrc: "/placeholder.svg?height=80&width=80&text=A",
        gender: "male",
      },
    ]);
  }, []);

  // Scene options with thumbnails
  const scenes = {
    Bedroom: "/placeholder.svg?height=100&width=100&text=Bedroom",
    Bathroom: "/placeholder.svg?height=100&width=100&text=Bathroom",
    Kitchen: "/placeholder.svg?height=100&width=100&text=Kitchen",
    "Swimming Pool": "/placeholder.svg?height=100&width=100&text=Pool",
    Garden: "/placeholder.svg?height=100&width=100&text=Garden",
    Gym: "/placeholder.svg?height=100&width=100&text=Gym",
    Elevator: "/placeholder.svg?height=100&width=100&text=Elevator",
    Office: "/placeholder.svg?height=100&width=100&text=Office",
    Classroom: "/placeholder.svg?height=100&width=100&text=Classroom",
    "High-End Restaurant":
      "/placeholder.svg?height=100&width=100&text=Restaurant",
    Beach: "/placeholder.svg?height=100&width=100&text=Beach",
    Dungeon: "/placeholder.svg?height=100&width=100&text=Dungeon",
    Bar: "/placeholder.svg?height=100&width=100&text=Bar",
    Street: "/placeholder.svg?height=100&width=100&text=Street",
    "Five-Star Hotel": "/placeholder.svg?height=100&width=100&text=Hotel",
  };

  // Gender-specific clothing options
  const clothing = {
    male: {
      "Jeans And T-Shirt":
        "/placeholder.svg?height=100&width=100&text=Jeans+Tee",
      Suit: "/placeholder.svg?height=100&width=100&text=Suit",
      "Leather Jacket": "/placeholder.svg?height=100&width=100&text=Leather",
      "Sports Outfit": "/placeholder.svg?height=100&width=100&text=Sports",
      "High-End Trench Coat":
        "/placeholder.svg?height=100&width=100&text=Trench+Coat",
      Sweater: "/placeholder.svg?height=100&width=100&text=Sweater",
      "Preppy Style Outfit":
        "/placeholder.svg?height=100&width=100&text=Preppy",
      Bathrobe: "/placeholder.svg?height=100&width=100&text=Bathrobe",
      "Groom Suit": "/placeholder.svg?height=100&width=100&text=Groom",
    },
    female: {
      "Casual Outfit": "/placeholder.svg?height=100&width=100&text=Casual",
      "Elegant Dress": "/placeholder.svg?height=100&width=100&text=Dress",
      "Business Attire": "/placeholder.svg?height=100&width=100&text=Business",
      "Workout Clothes": "/placeholder.svg?height=100&width=100&text=Workout",
      "Evening Gown": "/placeholder.svg?height=100&width=100&text=Gown",
      "Sweater & Jeans": "/placeholder.svg?height=100&width=100&text=Sweater",
      "Summer Outfit": "/placeholder.svg?height=100&width=100&text=Summer",
      Bathrobe: "/placeholder.svg?height=100&width=100&text=Bathrobe",
      "Wedding Dress": "/placeholder.svg?height=100&width=100&text=Wedding",
    },
  };

  // Pose options with images
  const poses = {
    Standing: "/placeholder.svg?height=100&width=100&text=Standing",
    Sitting: "/placeholder.svg?height=100&width=100&text=Sitting",
    Kneeling: "/placeholder.svg?height=100&width=100&text=Kneeling",
    "Hands On Hip": "/placeholder.svg?height=100&width=100&text=Hands+Hip",
    Leaning: "/placeholder.svg?height=100&width=100&text=Leaning",
    "Turned Away": "/placeholder.svg?height=100&width=100&text=Turned",
  };

  // Angle options with images
  const angles = {
    "Full Body": "/placeholder.svg?height=100&width=100&text=Full",
    "Half Body": "/placeholder.svg?height=100&width=100&text=Half",
    "Front View": "/placeholder.svg?height=100&width=100&text=Front",
    "Side View": "/placeholder.svg?height=100&width=100&text=Side",
    "Back View": "/placeholder.svg?height=100&width=100&text=Back",
  };

  const handleGenerate = () => {
    if (!selectedCharacter && !selectedGender && !uploadedImage) {
      alert("Please select or upload a character");
      return;
    }

    setIsGenerating(true);

    // Simulate image generation
    setTimeout(() => {
      const mockGeneratedImages = Array(imageCount)
        .fill(0)
        .map(
          (_, i) =>
            `/placeholder.svg?height=400&width=300&text=Generated-${i + 1}`
        );
      setGeneratedImages(mockGeneratedImages);
      setIsGenerating(false);
    }, 3000);
  };

  const handleRandom = () => {
    const sceneKeys = Object.keys(scenes);
    const clothingKeys = Object.keys(clothing[selectedGender]);
    const poseKeys = Object.keys(poses);
    const angleKeys = Object.keys(angles);

    setSelectedScene(sceneKeys[Math.floor(Math.random() * sceneKeys.length)]);
    setSelectedClothing(
      clothingKeys[Math.floor(Math.random() * clothingKeys.length)]
    );
    setSelectedPose(poseKeys[Math.floor(Math.random() * poseKeys.length)]);
    setSelectedAngle(angleKeys[Math.floor(Math.random() * angleKeys.length)]);
  };

  const handleImageCountClick = (count: number) => {
    setImageCount(count);
    // Redirect to premium page for 4 or 9 images
    if (count > 1) {
      router.push("/premium");
    }
  };

  const handleCharacterSelect = (id: string, gender: "male" | "female") => {
    setSelectedCharacter(id);
    setSelectedGender(gender);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadConfirm = () => {
    setOpenUploadDialog(false);
    setSelectedCharacter("custom");
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-[#1a0a24]">
      <Sidebar />

      <main className="flex-1 p-0">
        <div className="max-w-7xl mx-auto">
          {/* Character Selection Section */}
          <div className="bg-[#2a1a34] rounded-b-2xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-center mb-6 text-white">
              Upload an Image or Select a Character{" "}
              <span className="text-pink-500">*</span>
            </h2>
            <div className="flex items-center justify-center gap-6">
              {/* Enhanced Upload Button */}
              <div
                className="w-28 h-28 rounded-lg border-2 border-pink-500 bg-[#3a1a44] flex flex-col items-center justify-center cursor-pointer hover:bg-[#4a2a54] transition-colors shadow-lg shadow-pink-500/20"
                onClick={() => setOpenUploadDialog(true)}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-pink-500 rounded-full p-3 mb-2">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">Upload</span>
                </div>
              </div>

              {recentChats.map((character) => (
                <div
                  key={character.id}
                  className={`w-28 h-28 rounded-lg overflow-hidden cursor-pointer relative ${
                    selectedCharacter === character.id
                      ? "ring-2 ring-pink-500"
                      : ""
                  }`}
                  onClick={() =>
                    handleCharacterSelect(character.id, character.gender)
                  }
                >
                  <Image
                    src={character.imageSrc || "/placeholder.svg"}
                    alt={character.name}
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                  {selectedCharacter === character.id && (
                    <div className="absolute bottom-1 right-1 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-1 px-2">
                    <p className="text-xs text-white text-center">
                      {character.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Main content area with improved layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Scene and Pose */}
              <div className="lg:w-1/4 space-y-6">
                {/* Scene Selection */}
                <div
                  className={`relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                    selectedScene
                      ? "border-pink-500"
                      : "border-[#3a1a44] border-dashed"
                  }`}
                  onClick={() => setOpenDialog("scene")}
                >
                  {selectedScene ? (
                    <>
                      <div className="absolute top-0 left-0 bg-green-500 h-8 w-8 rounded-tr-lg rounded-bl-lg z-10 flex items-center justify-center">
                        <span className="text-white text-sm">🏠</span>
                      </div>
                      <Image
                        src={
                          scenes[selectedScene as keyof typeof scenes] ||
                          "/placeholder.svg"
                        }
                        alt={selectedScene}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <p className="text-white font-medium text-lg">
                          {selectedScene}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 bg-pink-500 rounded-full h-8 w-8 flex items-center justify-center">
                        <X
                          className="h-5 w-5 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScene(null);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Plus className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-400 text-lg font-medium">Scene</p>
                    </div>
                  )}
                </div>

                {/* Pose Selection */}
                <div
                  className={`relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                    selectedPose
                      ? "border-pink-500"
                      : "border-[#3a1a44] border-dashed"
                  }`}
                  onClick={() => setOpenDialog("pose")}
                >
                  {selectedPose ? (
                    <>
                      <div className="absolute top-0 left-0 bg-blue-500 h-8 w-8 rounded-tr-lg rounded-bl-lg z-10 flex items-center justify-center">
                        <span className="text-white text-sm">🧍</span>
                      </div>
                      <Image
                        src={
                          poses[selectedPose as keyof typeof poses] ||
                          "/placeholder.svg"
                        }
                        alt={selectedPose}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <p className="text-white font-medium text-lg">
                          {selectedPose}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 bg-pink-500 rounded-full h-8 w-8 flex items-center justify-center">
                        <X
                          className="h-5 w-5 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPose(null);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Plus className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-400 text-lg font-medium">Pose</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Center - Preview */}
              <div className="lg:w-2/4">
                {generatedImages.length > 0 ? (
                  <div>
                    <div
                      className={`grid ${
                        imageCount === 1
                          ? "grid-cols-1"
                          : imageCount === 4
                          ? "grid-cols-2"
                          : "grid-cols-3"
                      } gap-4`}
                    >
                      {generatedImages.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-[3/4] rounded-xl overflow-hidden relative group"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Generated image ${index + 1}`}
                            fill
                            className="object-cover w-full h-full"
                          />
                          {/* Download button overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full"
                              onClick={() => handleDownloadImage(image, index)}
                            >
                              <Download className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                      <Button
                        className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-8 h-auto rounded-xl text-xl font-medium"
                        onClick={() => {
                          setGeneratedImages([]);
                        }}
                      >
                        Generate New Images
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#2a1a34] rounded-xl h-[600px] flex items-center justify-center flex-col relative overflow-hidden">
                    {/* Background silhouette effect */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute left-1/4 top-1/4 w-1/2 h-3/4 bg-pink-500 rounded-full blur-3xl"></div>
                      <div className="absolute right-1/4 top-1/3 w-1/3 h-1/2 bg-purple-500 rounded-full blur-3xl"></div>
                    </div>

                    {isGenerating ? (
                      <div className="text-center z-10">
                        <div className="w-24 h-24 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-gray-300 text-2xl font-medium">
                          Generating your images...
                        </p>
                        <p className="text-sm text-gray-400 mt-3">
                          This may take a few minutes
                        </p>
                      </div>
                    ) : (
                      <div className="text-center px-6 z-10">
                        <div className="mb-8">
                          <Camera className="h-20 w-20 text-pink-500 mx-auto mb-4" />
                          <p className="text-2xl text-gray-300 mb-4 font-medium">
                            Create Your Perfect Image
                          </p>
                          <p className="text-base text-gray-400 mb-8">
                            Select preset elements on the sides and click
                            "Generate"
                          </p>
                        </div>
                        <Button
                          className="bg-pink-500 hover:bg-pink-600 text-white px-16 py-8 h-auto rounded-xl text-2xl font-medium shadow-lg shadow-pink-500/20"
                          onClick={handleGenerate}
                        >
                          Generate
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right side - Clothing and Angle */}
              <div className="lg:w-1/4 space-y-6">
                {/* Clothing Selection */}
                <div
                  className={`relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                    selectedClothing
                      ? "border-pink-500"
                      : "border-[#3a1a44] border-dashed"
                  }`}
                  onClick={() => setOpenDialog("clothing")}
                >
                  {selectedClothing ? (
                    <>
                      <div className="absolute top-0 left-0 bg-pink-500 h-8 w-8 rounded-tr-lg rounded-bl-lg z-10 flex items-center justify-center">
                        <span className="text-white text-sm">👕</span>
                      </div>
                      <Image
                        src={
                          clothing[selectedGender][
                            selectedClothing as keyof (typeof clothing)[typeof selectedGender]
                          ] || "/placeholder.svg"
                        }
                        alt={selectedClothing}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <p className="text-white font-medium text-lg">
                          {selectedClothing}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 bg-pink-500 rounded-full h-8 w-8 flex items-center justify-center">
                        <X
                          className="h-5 w-5 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClothing(null);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Plus className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-400 text-lg font-medium">
                        Clothing
                      </p>
                    </div>
                  )}
                </div>

                {/* Angle Selection */}
                <div
                  className={`relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                    selectedAngle
                      ? "border-pink-500"
                      : "border-[#3a1a44] border-dashed"
                  }`}
                  onClick={() => setOpenDialog("angle")}
                >
                  {selectedAngle ? (
                    <>
                      <div className="absolute top-0 left-0 bg-purple-500 h-8 w-8 rounded-tr-lg rounded-bl-lg z-10 flex items-center justify-center">
                        <span className="text-white text-sm">📐</span>
                      </div>
                      <Image
                        src={
                          angles[selectedAngle as keyof typeof angles] ||
                          "/placeholder.svg"
                        }
                        alt={selectedAngle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <p className="text-white font-medium text-lg">
                          {selectedAngle}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 bg-pink-500 rounded-full h-8 w-8 flex items-center justify-center">
                        <X
                          className="h-5 w-5 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAngle(null);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Plus className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-400 text-lg font-medium">Angle</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Random button */}
              <Button
                className="w-full py-8 h-auto bg-pink-500 hover:bg-pink-600 rounded-xl flex items-center justify-center gap-3 text-xl font-medium"
                onClick={handleRandom}
              >
                <Dice5 className="h-6 w-6" />
                Random
              </Button>

              {/* Number of images */}
              <div className="bg-[#2a1a34] rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4 text-center text-white">
                  Number of Images
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    className={`py-6 rounded-xl text-center text-lg ${
                      imageCount === 1
                        ? "bg-pink-500 text-white"
                        : "bg-[#3a1a44] text-gray-300 hover:bg-[#4a2a54]"
                    }`}
                    onClick={() => setImageCount(1)}
                  >
                    1
                  </button>
                  <button
                    className={`py-6 rounded-xl text-center text-lg relative ${
                      imageCount === 4
                        ? "bg-pink-500 text-white"
                        : "bg-[#3a1a44] text-gray-300 hover:bg-[#4a2a54]"
                    }`}
                    onClick={() => handleImageCountClick(4)}
                  >
                    4
                    <span className="absolute top-2 right-2 text-xs bg-pink-500 text-white px-1.5 py-0.5 rounded">
                      Premium
                    </span>
                  </button>
                  <button
                    className={`py-6 rounded-xl text-center text-lg relative ${
                      imageCount === 9
                        ? "bg-pink-500 text-white"
                        : "bg-[#3a1a44] text-gray-300 hover:bg-[#4a2a54]"
                    }`}
                    onClick={() => handleImageCountClick(9)}
                  >
                    9
                    <span className="absolute top-2 right-2 text-xs bg-pink-500 text-white px-1.5 py-0.5 rounded">
                      Premium
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent className="bg-[#1a0a24] border-[#3a1a44] max-w-md">
          <div className="flex flex-col items-center">
            <div
              className="w-40 h-40 rounded-lg border-2 border-dashed border-pink-500 flex items-center justify-center mb-6 cursor-pointer hover:bg-[#3a1a44] transition-colors"
              onClick={handleUploadClick}
            >
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded image"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-pink-500 rounded-full p-4 mb-3">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-base font-medium text-white">
                    Upload an Image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Click to browse files
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mb-4">
              <h3 className="text-white text-lg mb-3">
                Generated Style <span className="text-pink-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div
                  className={`flex items-center justify-center py-4 px-3 rounded-lg cursor-pointer ${
                    selectedGender === "male" ? "bg-[#3a1a44]" : "bg-[#2a1a34]"
                  }`}
                  onClick={() => setSelectedGender("male")}
                >
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      selectedGender === "male"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400"
                    } mr-2`}
                  ></div>
                  <span className="text-white text-lg">Male</span>
                </div>
                <div
                  className={`flex items-center justify-center py-4 px-3 rounded-lg cursor-pointer ${
                    selectedGender === "female"
                      ? "bg-[#3a1a44]"
                      : "bg-[#2a1a34]"
                  }`}
                  onClick={() => setSelectedGender("female")}
                >
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      selectedGender === "female"
                        ? "border-pink-500 bg-pink-500"
                        : "border-gray-400"
                    } mr-2`}
                  ></div>
                  <span className="text-white text-lg">Female</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-3">
                This influences the generated result.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedStyle === "realistic"
                      ? "border-pink-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedStyle("realistic")}
                >
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=Realistic"
                    alt="Realistic style"
                    width={150}
                    height={100}
                    className="w-full h-[120px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-2">
                    <p className="text-center text-white text-base">
                      Realistic
                    </p>
                  </div>
                  {selectedStyle === "realistic" && (
                    <div className="absolute bottom-3 right-3 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedStyle === "anime"
                      ? "border-pink-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedStyle("anime")}
                >
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=Anime"
                    alt="Anime style"
                    width={150}
                    height={100}
                    className="w-full h-[120px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-2">
                    <p className="text-center text-white text-base">Anime</p>
                  </div>
                  {selectedStyle === "anime" && (
                    <div className="absolute bottom-3 right-3 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full mt-6">
              <Button
                variant="outline"
                className="w-[48%] border-[#3a1a44] text-white hover:bg-[#3a1a44] py-3 text-base"
                onClick={() => setOpenUploadDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-[48%] bg-pink-500 hover:bg-pink-600 py-3 text-base"
                onClick={handleUploadConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selection Dialogs */}
      <Dialog
        open={!!openDialog}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      >
        <DialogContent className="bg-[#1a0a24] border-[#3a1a44] max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Select{" "}
            {openDialog === "scene"
              ? "Scene"
              : openDialog === "clothing"
              ? "Clothing"
              : openDialog === "pose"
              ? "Pose"
              : "Angle"}
          </h2>

          {openDialog === "scene" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {Object.entries(scenes).map(([name, imageSrc]) => (
                <div
                  key={name}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedScene === name ? "ring-2 ring-pink-500" : ""
                  }`}
                  onClick={() => setSelectedScene(name)}
                >
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <p className="text-white text-sm text-center px-1">
                      {name}
                    </p>
                  </div>
                  {selectedScene === name && (
                    <div className="absolute bottom-2 right-2 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {openDialog === "clothing" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {Object.entries(clothing[selectedGender]).map(
                ([name, imageSrc]) => (
                  <div
                    key={name}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                      selectedClothing === name ? "ring-2 ring-pink-500" : ""
                    }`}
                    onClick={() => setSelectedClothing(name)}
                  >
                    <Image
                      src={imageSrc || "/placeholder.svg"}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <p className="text-white text-sm text-center px-1">
                        {name}
                      </p>
                    </div>
                    {selectedClothing === name && (
                      <div className="absolute bottom-2 right-2 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {openDialog === "pose" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {Object.entries(poses).map(([name, imageSrc]) => (
                <div
                  key={name}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedPose === name ? "ring-2 ring-pink-500" : ""
                  }`}
                  onClick={() => setSelectedPose(name)}
                >
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <p className="text-white text-sm text-center px-1">
                      {name}
                    </p>
                  </div>
                  {selectedPose === name && (
                    <div className="absolute bottom-2 right-2 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {openDialog === "angle" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {Object.entries(angles).map(([name, imageSrc]) => (
                <div
                  key={name}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedAngle === name ? "ring-2 ring-pink-500" : ""
                  }`}
                  onClick={() => setSelectedAngle(name)}
                >
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <p className="text-white text-sm text-center px-1">
                      {name}
                    </p>
                  </div>
                  {selectedAngle === name && (
                    <div className="absolute bottom-2 right-2 bg-pink-500 rounded-full h-6 w-6 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              className="w-[48%] border-[#3a1a44] text-white hover:bg-[#3a1a44] py-3 text-base"
              onClick={() => setOpenDialog(null)}
            >
              Cancel
            </Button>
            <Button
              className="w-[48%] bg-pink-500 hover:bg-pink-600 py-3 text-base"
              onClick={() => setOpenDialog(null)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
