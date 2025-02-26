import React, { createContext, useState, useContext } from "react";

export const ImageContext = createContext();

const ImageContextProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState("");

    const handleImageHandler = async (prompt) => {
        if (!prompt.trim()) {
            alert("Please enter a prompt.");
            return;
        }

        try {
            setLoading(true);
            setGeneratedImage(""); 
            setRecentPrompt(prompt);
            setPrevPrompts((prev) => [...prev, prompt]);

            const response = await fetch("/generateImage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const responseText = await response.text();
                alert(`Error: ${responseText}`);
                return;
            }

            const data = await response.json();
            if (!data.image) {
                throw new Error("No image data received.");
            }

            const imageData = `data:image/jpeg;base64,${data.image}`;
            setGeneratedImage(imageData);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("Error generating image, please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        recentPrompt,
        loading,
        generatedImage,
        input,
        setInput,
        handleImageHandler,
    };

    return (
        <ImageContext.Provider value={contextValue}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImage = () => {
    return useContext(ImageContext);
};

export default ImageContextProvider;
