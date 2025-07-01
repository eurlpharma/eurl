import AIButton from "@/components/buttons/AIButton";
import axios from "axios";
import { ChangeEvent, FC, HTMLAttributes, useEffect, useState } from "react";

interface rmBackgroundProps extends HTMLAttributes<HTMLElement> {
  multiple?: boolean;
}

interface Result {
  name?: string;
  url?: string | null;
  error?: boolean;
}

const RmBackground: FC<rmBackgroundProps> = ({}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isChoose, setIsChoosed] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const apiKey = "71RydmCBxN3oZefpsuiMHEws";
  const apiUrl = "https://api.remove.bg/v1.0/removebg";

  /* on file selected */
  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResults([]);
    }
  };

  /* remove background online */
  const removeBackground = async () => {
    setLoading(true);
    const tempResults: Result[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("size", "auto");
      formData.append("image_file", file);

      try {
        const res = await axios.post<Blob>(apiUrl, formData, {
          responseType: "blob",
          headers: {
            "X-Api-Key": apiKey,
          },
        });

        const imageUrl = URL.createObjectURL(res.data);
        tempResults.push({ name: file.name, url: imageUrl });
      } catch (err) {
        tempResults.push({ name: file.name, url: null, error: true });
      }
    }

    setResults(tempResults);
    setLoading(false);
  };

  useEffect(() => {
    if (results && results?.length > 0) {
      setIsChoosed(true);
    } else {
      setIsChoosed(false);
    }
  }, [results]);

  return (
    <div>
      <input
        multiple
        type={"file"}
        accept="image/*"
        onChange={handleChangeFile}
      />

      <AIButton onClick={removeBackground} isLoading={loading}>
        Remove Background
      </AIButton>

      {isChoose ? (
        <div className="flex items-start gap-3 py-3">
          {results.map((result, index) => (
            <div key={index}>
              {result.url ? (
                <img
                  src={result.url}
                  alt={result.name}
                  className="bg-[#000000] h-24 w-24 object-cover rounded-lg"
                />
              ) : (
                <div>Field Process</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-3 py-3">
          {files.length > 0 &&
            files.map((file, index) => {
              return (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  className="bg-[#000000] w-24 h-24 object-cover rounded-lg"
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default RmBackground;
