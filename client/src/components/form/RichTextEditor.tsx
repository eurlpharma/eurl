import { useState, useEffect, FC, useRef } from "react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

// Import the required CSS for the editor
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder,
  height = 200,
}) => {
  const { t } = useTranslation();
  const isMounted = useRef(true);
  const [editorState, setEditorState] = useState(() => {
    if (!value) {
      return EditorState.createEmpty();
    }

    try {
      const blocksFromHtml = htmlToDraft(value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      return EditorState.createWithContent(contentState);
    } catch (error) {
      console.error("Error parsing HTML to Draft:", error);
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!value) {
      if (isMounted.current) setEditorState(EditorState.createEmpty());
      return;
    }
    // Only update the editor state from props if the HTML content is different
    // This prevents cursor jumping when typing
    const currentContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    if (currentContent !== value) {
      try {
        const blocksFromHtml = htmlToDraft(value);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        if (isMounted.current) setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error parsing HTML to Draft:", error);
      }
    }
  }, [value]);

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContentState);

    onChange(htmlContent);
  };

  return (
    <FormControl fullWidth error={!!error} className="mb-4">
      {label && <FormLabel className="mb-2">{label}</FormLabel>}
      <div
        className={`border rounded-md font-poppins ${
          error ? "border-red-500" : "border-gray-300"
        } overflow-hidden`}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
          wrapperClassName="w-full h-96 font-poppins"
          editorClassName={`px-3 py-2 font-poppins min-h-[${height}px]`}
          placeholder={placeholder || t("form.richTextPlaceholder")}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "list",
              "textAlign",
            ],
            inline: {
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            blockType: {
              options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
            },
            textAlign: {
              options: ["left", "center", "right", "justify"],
            },
          }}
        />
      </div>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default RichTextEditor;
