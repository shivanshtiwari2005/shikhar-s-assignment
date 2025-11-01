import { client } from "../../src/sanity/lib/client";
import { urlFor } from "../../src/sanity/lib/image";
import type { GetServerSideProps } from "next";
import { PortableText } from "@portabletext/react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!;
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{_id, title, description, mainImage, body}`,
    { slug }
  );
  
  if (!post) {
    return { notFound: true };
  }
  
  return { props: { post } };
};

export default function BlogPage({ post }: { post: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post?.title || "");
  const [editedDescription, setEditedDescription] = useState(post?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editedTitle || !editedDescription) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("id", post._id);
      formData.append("title", editedTitle);
      formData.append("description", editedDescription);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/updatePost", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      toast.success("Blog updated!");
      setIsEditing(false);
      // Force reload with fresh data
      setTimeout(() => router.reload(), 1000);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Error updating blog: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      toast.success("Blog deleted!");
      setShowDeleteConfirm(false);
      // Force a hard refresh to home page
      setTimeout(() => {
        router.push("/").then(() => router.reload());
      }, 1000);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Error deleting blog: " + (error as Error).message);
      setIsDeleting(false);
    }
  }

  function getImageUrl(imageData: any) {
    if (imageData?.asset?._ref || imageData?.asset?._id) {
      try {
        return urlFor(imageData).width(1200).height(800).url();
      } catch (error) {
        console.error("Error generating image URL:", error);
        return null;
      }
    }
    return null;
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex flex-col items-center justify-center">
        <Toaster position="top-right" />
        <div className="text-center animate-fadeIn">
          <div className="text-8xl mb-6">😕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog not found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl btn-animate shadow-lg">
              ← Back to Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Actions */}
        <div className="mb-8 animate-slideIn flex justify-between items-center">
          <Link href="/">
            <button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 btn-animate shadow-lg border border-gray-200">
              ← Back to Blogs
            </button>
          </Link>
          
          {/* Edit and Delete Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 btn-animate shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 disabled:bg-gray-400 btn-animate shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
              <div className="p-8">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Delete Blog Post?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete this blog post? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 disabled:bg-gray-400 btn-animate shadow-lg"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 disabled:bg-gray-100 btn-animate"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Edit Blog Post
                  </h2>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Update Cover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-all cursor-pointer bg-gray-50 hover:bg-blue-50"
                    >
                      <span className="text-sm text-gray-600">
                        {imageFile ? imageFile.name : "Click to upload new image (optional)"}
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="mt-4 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-gray-900"
                      rows={8}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 btn-animate shadow-lg"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 btn-animate"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Blog Content Card */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn border border-gray-200">
          {/* Blog Image */}
          {getImageUrl(post.mainImage) && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={getImageUrl(post.mainImage) || ""}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  {post.title}
                </h1>
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8 md:p-12">
            {/* Title if no image */}
            {!getImageUrl(post.mainImage) && (
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                {post.title}
              </h1>
            )}

            {/* Blog Body or Description */}
            {post.body && post.body.length > 0 ? (
              <div className="prose prose-lg max-w-none prose-headings:!text-gray-900 prose-p:!text-gray-900 prose-a:!text-blue-600 prose-strong:!text-gray-900 prose-li:!text-gray-900 [&_*]:!text-gray-900">
                <PortableText value={post.body} />
              </div>
            ) : post.description ? (
              /* Show description as main content if no body */
              <div className="prose prose-lg max-w-none">
                <p className="!text-gray-900 text-xl leading-relaxed whitespace-pre-wrap">
                  {post.description}
                </p>
              </div>
            ) : (
              /* No content at all */
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📄</div>
                <p className="text-gray-500 italic">No content available for this post.</p>
              </div>
            )}
          </div>
        </article>

        {/* Back to top button */}
        <div className="mt-8 text-center animate-fadeIn">
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl btn-animate shadow-lg">
              ← Back to All Blogs
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
