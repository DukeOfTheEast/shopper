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
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, "users", currentUser.uid); // Reference to the user's Firestore document
        const docSnap = await getDoc(userRef); // Fetch the document

        if (docSnap.exists()) {
          const userData = docSnap.data();
          let history = userData.orderHistory || [];
          history = history.sort((a, b) => b.timestamp - a.timestamp);
          setOrderHistory(history); // Get the orderHistory array
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [currentUser, setOrderHistory]);

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
          <p>
            Name: <span className="font-bold">{currentUser?.fullName}</span>
          </p>
          <p>
            Email: <span className="font-bold">{currentUser?.email}</span>
          </p>
        </div>
      </div>

      <hr className="w-3/4 mx-auto" />
      <hr className="w-3/4 mx-auto" />
      <div className="mx-4 my-6">
        <h1 className="font-bold text-green-500">History</h1>

        {orderHistory.length > 0 ? (
          orderHistory.map((order, index) => (
            <div key={index} className="mb-4 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Order #{index + 1}</h3>
              <p>Date: {new Date(order.timestamp).toLocaleString()}</p>
              <ul className="mt-3">
                {order.items.map((item, i) => (
                  <li
                    key={i}
                    className="mb-2 flex items-center gap-3 text-sm sm:text-base"
                  >
                    <Image
                      className="w-8 h-8"
                      src={item.image}
                      alt="item"
                      width={300}
                      height={300}
                    />
                    <p>{item.name}</p>
                    <p className="hidden sm:block">(x{item.quantity})</p>
                    <p className="hidden sm:block">- &#8358;{item.price}</p>
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">Total: &#8358;{}</p>
              <hr className="w-full" />
            </div>
          ))
        ) : (
          <p className="flex items-center justify-center italic">
            You have no order history.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
