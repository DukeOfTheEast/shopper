"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/Auth/page";
import Image from "next/image";
import Default from "@/images/default-image.png";
import { db, storage } from "@/app/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useProfile } from "@/context/Profile/page";

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
      <input
        type="file"
        id="file-input"
        onChange={handleImageChange}
        className="sr-only"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        Upload
      </label>
      {currentUser && (
        <Image
          src={currentUser.photoURL || photoURL}
          alt="profile"
          height={300}
          width={300}
          priority
          className="rounded-full"
        />
      )}
    </div>
  );
};

export default UserProfile;
