import axios from "axios";
import styles from "./AddContent.module.css";
import { useEffect, useState } from "react";
import IModule from "../../interfaces/IModule";
import { DateTime } from "luxon";

const ModuleLiveLink = ({
  selectedModule,
}: {
  selectedModule: IModule | null;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [prevLink, setPrevLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${backend}/live-link/delete/${selectedModule?._id}`);
      setPrevLink(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchLiveLink = async () => {
      setPrevLink(null);
      try {
        setLoading(true);
        const res = await axios.post(`${backend}/live-link/get-module-link`, {
          moduleId: selectedModule?._id,
        });
        setPrevLink(res.data.payload.link);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveLink();
  }, [backend, selectedModule]);

  const handleSubmitLiveLink = async (event: React.FormEvent) => {
    setSubmitting(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const startsAtRaw = (
      form.elements.namedItem("startsAt") as HTMLInputElement
    ).value;
    const endsAtRaw = (form.elements.namedItem("endsAt") as HTMLInputElement)
      .value;
    const link = (form.elements.namedItem("link") as HTMLInputElement).value;
    const timeZone = (form.elements.namedItem("timeZone") as HTMLSelectElement)
      .value;

    // Convert local datetime string to UTC according to selected timezone
    const startsAt = DateTime.fromISO(startsAtRaw, { zone: timeZone })
      .toUTC()
      .toISO();
    const endsAt = DateTime.fromISO(endsAtRaw, { zone: timeZone })
      .toUTC()
      .toISO();

    await axios.post(`${backend}/live-link/create`, {
      name,
      startsAt,
      endsAt,
      link,
      timeZone,
      moduleId: selectedModule?._id,
    });
    alert("Added Successfully!");
    setSubmitting(false);
    setPrevLink(link);
  };
  return (
    <div>
      {loading ? (
        <p>loading live link</p>
      ) : !prevLink ? (
        <p>no live link available</p>
      ) : (
        <div className={styles.prevLinkRow}>
          <a
            style={{
              width: "90%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            href={prevLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {prevLink}
          </a>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className={styles.deleteLiveLinkBtn}
            title="Delete live link"
          >
            {deleting ? "Deleting..." : "🗑️"}
          </button>
        </div>
      )}
      <form className={styles.contentForm} onSubmit={handleSubmitLiveLink}>
        <input type="text" name="name" placeholder="Name" required />
        <input
          type="datetime-local"
          name="startsAt"
          onChange={(e) => {
            setTimeout(() => e.target.blur(), 1);
          }}
          required
        />
        <input
          type="datetime-local"
          name="endsAt"
          onChange={(e) => {
            setTimeout(() => e.target.blur(), 1);
          }}
          required
        />
        <select
          name="timeZone"
          required
          defaultValue="Asia/Riyadh"
          className={styles.formInput}
        >
          {Intl.supportedValuesOf("timeZone").map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <input type="url" name="link" placeholder="Live Link URL" required />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting" : `Submit Live Link`}
        </button>
      </form>
    </div>
  );
};

export default ModuleLiveLink;
