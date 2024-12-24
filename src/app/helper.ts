import axios from "axios";


// Define a TypeScript type for the file image input
export const sendImageToIPFS = async (fileImg: File) => {
    if (fileImg) {
        try {
            const formData = new FormData();
            formData.append("file", fileImg);

            const response = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const IpfsHash = response.data.IpfsHash;
            const imageUri = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
            return imageUri;
        } catch (error) {
            console.log("Error sending file to IPFS:", error);
            throw error;
        }
    }
};


