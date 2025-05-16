import { useEffect, useRef, useState } from "react";

const PeerReviewForm = () => {
  const formContainerRef = useRef(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/form");
        const html = await response.text();

        if (formContainerRef.current) {
          formContainerRef.current.innerHTML = html;

          // Attach event listeners to the dynamically loaded form
          const form =
            formContainerRef.current.querySelector("#peerReviewForm");
          const previewBtn =
            formContainerRef.current.querySelector("#previewBtn");

          if (form) {
            form.addEventListener("submit", (e) => {
              e.preventDefault();
              handleSubmit();
            });
          }

          if (previewBtn) {
            previewBtn.addEventListener("click", (e) => {
              e.preventDefault();
              handlePreview();
            });
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();

    return () => {
      // Clean up event listeners
      if (formContainerRef.current) {
        const form = formContainerRef.current.querySelector("#peerReviewForm");
        const previewBtn =
          formContainerRef.current.querySelector("#previewBtn");

        if (form) {
          form.removeEventListener("submit", handleSubmit);
        }

        if (previewBtn) {
          previewBtn.removeEventListener("click", handlePreview);
        }
      }
    };
  }, []);

  const collectFormData = () => {
    const form = formContainerRef.current?.querySelector("#peerReviewForm");
    if (!form) return {};

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Handle checkbox groups
    data.applyReason = Array.from(
      form.querySelectorAll('input[name="applyReason"]:checked')
    ).map((cb) => cb.value);

    data.reviewerOption = Array.from(
      form.querySelectorAll('input[name="reviewerOption"]:checked')
    ).map((cb) => cb.value);

    return data;
  };

  const handlePreview = async () => {
    const data = collectFormData();

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/form/preview-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Preview generation failed");
      }

      const html = await response.text();
      setPreviewHtml(html);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate preview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = collectFormData();

      const response = await fetch("http://localhost:3000/form/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("PDF generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ICAI_Peer_Review_Application.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
      setShowPreviewModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false);
  };

  return (
    <div className="relative mt-10 p-10 mx-auto">
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Main form container */}
      <div ref={formContainerRef} className="form-container " />

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Preview Application</h2>
            </div>
            <div
              className="p-4 overflow-y-auto flex-grow"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
            <div className="p-4 border-t flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                No, Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes, Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerReviewForm;
