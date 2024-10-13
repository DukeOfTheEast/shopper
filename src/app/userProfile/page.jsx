"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/Auth/page";
import Image from "next/image";
import Default from "@/images/default-image.png";
import { db, storage } from "@/app/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useProfile } from "@/context/Profile/page";
import { UploadIcon } from "lucide-react";
import Navbar from "@/components/navbar/page";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { photoURL, setPhotoURL } = useProfile();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();

        if (docSnap.exists()) {
          setPhotoURL(userData?.photoURL);
        }
      }
    };

    fetchProfileImage();
  }, [currentUser, setPhotoURL]);

  const handleImageChange = async (e) => {
    if (currentUser) {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please select a valid image file.");
          return;
        }

        // Reference to where the image will be stored in Firebase Storage
        const imageRef = ref(storage, `users/${currentUser.uid}/profile.jpg`);

        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload to Firebase failed:", error);
            alert("Failed to upload image to Firebase. Please try again.");
          },
          async () => {
            try {
              // Get the download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              // Update state with the new photo URL
              setPhotoURL(downloadURL);

              // Update Firestore with the new photo URL
              await setDoc(
                doc(db, "users", currentUser.uid),
                {
                  photoURL: downloadURL,
                },
                { merge: true }
              );

              console.log(
                "Image uploaded successfully. Download URL:",
                downloadURL
              );
            } catch (error) {
              console.error("Error uploading image: ", error);
              alert("Failed to upload image. Please try again.");
            }
          }
        );
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row-reverse items-center gap-4 mt-20 mb-5">
          <div className="">
            <input
              type="file"
              id="file-input"
              onChange={handleImageChange}
              className="sr-only"
            />

            <label
              htmlFor="file-input"
              className="cursor-pointer bg-green-500 text-white px-5 py-2 rounded-xl gap-2 flex"
            >
              <UploadIcon size={25} />
              <p>Upload</p>
            </label>
          </div>
          {currentUser && (
            <Image
              src={currentUser.photoURL || photoURL}
              alt="profile"
              height={300}
              width={300}
              priority
              className="rounded-full w-40 h-40"
            />
          )}
        </div>
        <div className="mb-2">
          <p>Name: {currentUser?.fullName}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      </div>

      <hr className="w-3/4 mx-auto" />
      <hr className="w-3/4 mx-auto" />
      <div className="mx-4 my-6">
        <h1 className="font-bold text-green-500">History</h1>
        <div className="flex items-center justify-center italic">
          <p>No activities yet</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
