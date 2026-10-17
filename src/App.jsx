import toast, { Toaster } from "react-hot-toast";
import useGallery from "./lib/img.lib";
import { createElement } from "react";

const maxSizeAllowed = (5 * 1024 * 1024)

const App = () => {

  const { images, addImage, deleteAll, deleteImage } = useGallery();

  // SAVE IMAGE
  const handleImageUpload = (e) => {

    const input = e.target;
    const file = input.files[0];

    if (!file.type.startsWith("image/")) {
      return toast.error("Invalid Image");
    }

    if (file.size >= maxSizeAllowed) {
      return toast.error(`Max ${(5 * 1024 * 1024 / (1024 * 1024)).toFixed(2)} MB Allowed`);
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {

      try {

        addImage({
          id: Date.now(),
          name: file.name,
          size: file.size,
          url: fileReader.result,
          createdAt: new Date(),
        });

      } catch (err) {

        if (err.message === "Failed to execute 'setItem' on 'Storage': Setting the value of 'myGallery' exceeded the quota.") {
          return toast.error("Image Add Failed Because Quota Exceeded");
        }

        toast.error(err.message);

      }

    };

  };

  // DELETE ALL IMAGES
  const handleDeleteAll = () => {

    // METHOD 1
    deleteAll();

    // METHOD 2
    // localStorage.clear("myGallery");
  };

  // DELETE SINGLE IMAGE
  const handleDelete = (id) => {
    deleteImage(id);
  };

  // DOWNLOAD IMAGE
  const handleDownload = (url, name) => {
    try {
      let a = document.createElement("a");
      a.href = url,
        a.download = name,
        document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-10">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <i className="ri-gallery-line text-2xl" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Image Gallery
                </h1>

              </div>

              <p className="text-sm text-slate-500">
                Manage and organize your images in one place.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              {images.length !== 0 &&
                <button
                  onClick={handleDeleteAll}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                >
                  <i className="ri-delete-bin-6-line text-lg transition-transform duration-300 group-hover:scale-110" />
                  <span>Delete All</span>
                </button>
              }

              <label
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 active:translate-y-0"
              >
                <i className="ri-add-line text-xl transition-transform duration-300 group-hover:rotate-90" />
                <span>Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>

            </div>

          </div>

          {/* GALLERY SUMMARY */}
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Your Collection</h2>
              <p className="mt-1 text-sm text-slate-500">All your uploaded images, organized and ready to use.</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
              <i className="ri-image-2-line text-base" />
              <span>{images.length} Images</span>
            </div>
          </div>

          {images.length === 0 && <EmptyGallery />}

          {/* CONTENT */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {images.map((item, idx) => (

              <div
                key={idx}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60"
              >

                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-100">

                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-all duration-300 hover:bg-red-50 hover:text-red-600">
                    <i className="ri-image-line text-lg" />
                  </div>

                </div>

                <div className="p-5">

                  <div className="mb-5 flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="truncate text-base font-semibold text-slate-800 transition-colors duration-300 group-hover:text-indigo-600">
                        {item.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <i className="ri-file-info-line text-sm" />
                        {(item.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                    </div>

                    <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                      Image
                    </span>

                  </div>

                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4">

                    <button
                      onClick={() => handleDownload(item.url, item.name)}
                      className="group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white active:scale-95"
                    >
                      <i className="ri-download-2-line text-lg transition-transform duration-300 group-hover/btn:translate-y-0.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="group/btn inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-500 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                    >
                      <i className="ri-delete-bin-6-line text-lg transition-transform duration-300 group-hover/btn:scale-110" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>

      <Toaster />
    </>
  );
};

const EmptyGallery = () => {
  return (

    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center transition-all duration-300 hover:border-indigo-300">

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 transition-transform duration-300 hover:scale-105">
        <i className="ri-gallery-line text-4xl" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-800">
        Your gallery is empty
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        You haven't uploaded any images yet. Add your first image to start building your collection.
      </p>

    </div>

  );
};

export default App;