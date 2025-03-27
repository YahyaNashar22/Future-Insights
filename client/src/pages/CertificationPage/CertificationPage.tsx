import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

import styles from "./CertificationPage.module.css";
import { useEffect, useRef, useState } from "react";
import ICertification from "../../interfaces/ICertification";
import { useUserStore } from "../../store";
import Loading from "../../components/Loading/Loading";

const CertificationPage = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const certificateRef = useRef<HTMLDivElement>(null);
  const [certification, setCertification] = useState<ICertification | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/certification/get/${slug}`);
        if (!res.data.payload) navigate("*");
        setCertification(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertification();
  }, [backend, navigate, user, slug]);

  // Function to Download as PDF
  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    // Increase resolution with scale: 3 (higher value = better quality)
    const canvas = await html2canvas(certificateRef.current, {
      scale: 3, // 3x the resolution for better quality
      useCORS: true, // Ensure external images load correctly
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width / 3; // Adjust for the scale factor
    const imgHeight = canvas.height / 3;

    const pdf = new jsPDF("landscape", "px", [imgWidth, imgHeight]);

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Certificate-${certification?.userId.fullname}.pdf`);
  };
  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          {certification && (
            <div ref={certificateRef}>
              <div className={styles.header}>
                Certification for {certification.userId.fullname}
              </div>

              <div className={styles.details}>
                <p>
                  <strong>Issued on:</strong>{" "}
                  {new Date(certification.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Certificate ID:</strong> {certification.slug}
                </p>
              </div>

              {certification.courseId && (
                <div className={styles.courseInfo}>
                  <h3>{certification.courseId.title} Completion</h3>
                  <p className={styles.certificationText}>
                    <span className={styles.awardText}>
                      This certificate is proudly awarded by{" "}
                      <strong className={styles.brandName}>
                        Future Insights
                      </strong>{" "}
                      to{" "}
                      <strong className={styles.studentName}>
                        {certification.userId.fullname}
                      </strong>
                    </span>
                    <span className={styles.recognitionText}>
                      <br />
                      in recognition of successfully completing all course
                      materials.
                      <br />
                      We wish you continued success and growth in your future
                      learning endeavors!
                    </span>
                  </p>
                  <p className={styles.teacher}>
                    Taught by:{" "}
                    <strong>{certification.courseId.teacher.fullname}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
          <button className={styles.certificateButton} onClick={downloadPDF}>
            Download Certificate
          </button>
        </div>
      )}
    </main>
  );
};

export default CertificationPage;
