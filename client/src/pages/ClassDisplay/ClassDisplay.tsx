import { Link, useParams } from "react-router-dom";
import styles from "./ClassDisplay.module.css";
import { useEffect, useState } from "react";
import IClass from "../../interfaces/IClass";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import ISession from "../../interfaces/ISession";
import IAssessment from "../../interfaces/IAssessment";

const ClassDisplay = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();

  const [cls, setCls] = useState<IClass | null>(null);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [assignments, setAssignments] = useState<IAssessment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);
        setCls(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [backend, slug]);

  useEffect(() => {
    if (!cls?._id) return;

    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `${backend}/session/get-class-sessions/${cls._id}`
        );
        setSessions(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAssessments = async () => {
      try {
        const res = await axios.get(
          `${backend}/assessment/${cls._id}/assessments`
        );
        setAssessments(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${backend}/assessment/${cls._id}/assignments`
        );
        setAssignments(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssessments();
    fetchAssignments();
    fetchSessions();
  }, [backend, cls]);

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          {/* Left Side  */}
          <div className={styles.left}>
            <h1 className={styles.classTitle}>{cls?.title}</h1>
            <img
              src={`${backend}/${cls?.thumbnail}`}
              alt={cls?.title}
              className={styles.thumbnail}
            />
            <p className={styles.description}>{cls?.description}</p>
            <p className={styles.duration}>Duration: {cls?.duration}</p>
          </div>

          {/* Right Side  */}
          <div className={styles.right}>
            <h2 className={styles.sectionTitle}>Latest Link:</h2>

            {cls && sessions.length > 0 ? (
              <>
                {sessions[sessions.length - 1].link ? (
                  <a
                    href={sessions[sessions.length - 1].link}
                    className={styles.link}
                    target="_blank"
                  >
                    {sessions[sessions.length - 1].link}
                  </a>
                ) : (
                  <p className={styles.noData}>Link preview not available</p>
                )}
              </>
            ) : (
              <p className={styles.noData}>No sessions available</p>
            )}
            <h2 className={styles.sectionTitle}>Recordings</h2>
            <ul className={styles.listContainer}>
              {sessions.length > 0 ? (
                sessions.map((s) => (
                  <li key={s._id} className={styles.listItem}>
                    {s.recording ? (
                      <a
                        href={s.recording}
                        className={styles.link}
                        target="_blank"
                      >
                        {s.recording}
                      </a>
                    ) : (
                      <p className={styles.noData}>
                        Session recording not available
                      </p>
                    )}
                  </li>
                ))
              ) : (
                <p className={styles.noData}>No recordings available</p>
              )}
            </ul>

            <h2 className={styles.sectionTitle}>Assessments</h2>
            <ul className={styles.listContainer}>
              {assessments.length > 0 ? (
                assessments.map((s) => (
                  <li key={s._id} className={styles.listItem}>
                    <Link to={`/assessment/${s.slug}`} className={styles.link}>
                      {s.title}
                    </Link>
                  </li>
                ))
              ) : (
                <p className={styles.noData}>No assessments added yet</p>
              )}
            </ul>

            <h2 className={styles.sectionTitle}>Assignments</h2>
            <ul className={styles.listContainer}>
              {assignments.length > 0 ? (
                assignments.map((s) => (
                  <li key={s._id} className={styles.listItem}>
                    <Link to={`/assignment/${s.slug}`} className={styles.link}>
                      {s.title}
                    </Link>
                  </li>
                ))
              ) : (
                <p className={styles.noData}>No assignments added yet</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default ClassDisplay;
