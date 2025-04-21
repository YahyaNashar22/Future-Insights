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

    const canvas = await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width / 3;
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
              <div className={styles.header}>Certificate of Completion</div>

              <div className={styles.details}>
                <p>
                  <strong>Issued to:</strong> {certification.userId.fullname}
                </p>
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
                  <h3>Completion of Course</h3>
                  <p className={styles.certificationText}>
                    This is to certify that{" "}
                    <strong>{certification.userId.fullname}</strong> has
                    successfully completed all the requirements for the course{" "}
                    <strong>{certification.courseId.title}</strong>.
                  </p>
                  <p className={styles.teacher}>
                    Instructor:{" "}
                    <strong>{certification.courseId.teacher.fullname}</strong>
                  </p>
                </div>
              )}

              {certification.classId && (
                <div className={styles.courseInfo}>
                  <h3>Completion of Course</h3>
                  <p className={styles.certificationText}>
                    This is to certify that{" "}
                    <strong>{certification.userId.fullname}</strong> has
                    successfully completed all the requirements for the course{" "}
                    <strong>{certification.classId.title}</strong>.
                  </p>
                  <p className={styles.teacher}>
                    Instructor:{" "}
                    <strong>{certification.classId.teacher.fullname}</strong>
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
