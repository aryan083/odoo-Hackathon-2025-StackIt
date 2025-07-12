import Tiptap from "../components/TipTap";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { X, Plus, ArrowLeft } from "lucide-react";
import { createQuestion } from "../api/questions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreatePost() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const [loading, setLoading] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[80vh] bg-muted py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Create a Post</h2>
        <p className="text-muted-foreground mb-6">Share your question, idea, or story with the community.</p>
        
        <div className="mb-4">
          <Input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="text-lg font-medium mb-2 bg-muted/50 border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
            placeholder="Title (e.g. How do I use TipTap with React?)"
            maxLength={120}
          />
        </div>
        
        <div className="mb-6">
          <Tiptap />
        </div>

        {/* Tags/Categories Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag (e.g. React, JavaScript)"
              className="flex-1"
            />
            <Button
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-4 py-2 bg-[#165cfa] text-white rounded-md hover:bg-[#165cfa]/90 transition-colors border border-[#165cfa]"
            >
              <Plus size={16} />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#165cfa]/10 text-[#165cfa] rounded-full text-sm font-medium border border-[#165cfa]/20"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-[#165cfa]/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={async ()=>{
              const bodyHtml = (document.querySelector('.tiptap') as HTMLElement)?.innerHTML || '';
              setLoading(true);
              try {
                await createQuestion(title, bodyHtml, tags);
                navigate('/home');
              } catch(err){
                alert('Failed to post');
                console.error(err);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !title.trim()}
            className="px-6 py-2 rounded-lg text-base font-semibold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition">
             Post
           </Button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
