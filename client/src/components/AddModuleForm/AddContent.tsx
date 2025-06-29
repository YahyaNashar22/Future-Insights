import { useState, useEffect } from "react";
import styles from "./AddContent.module.css";
import IClass from "../../interfaces/IClass";
import IModule from "../../interfaces/IModule";
import { useUserStore } from "../../store";
import axios, { AxiosError } from "axios";
import ICourse from "../../interfaces/ICourse";
import ModuleRecordings from "./ModuleRecordings";
import ModuleMaterial from "./ModuleMaterial";
import ModuleAssessment from "./ModuleAssessment";

const AddContentForm = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [classes, setClasses] = useState<IClass[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [modules, setModules] = useState<IModule[]>([]);

  const [selectedClass, setSelectedClass] = useState<IClass | ICourse | null>(
    null
  );
  const [selectedModule, setSelectedModule] = useState<IModule | null>(null);

  const [selectedForm, setSelectedForm] = useState<
    "liveLink" | "recording" | "material" | "assessment" | null
  >(null);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/class/get-by-teacher`,
          { teacherId: user?._id },
          { headers: { "Content-Type": "application/json" } }
        );
        setClasses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [backend, user]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/course/get-by-teacher`,
          { teacherId: user?._id },
          { headers: { "Content-Type": "application/json" } }
        );
        setCourses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [backend, user]);

  // Fetch modules based on selected class

  const fetchClassModules = async () => {
    try {
      setLoading(true);

      const params: { [key: string]: string } = {};
      params.userId = user?._id || "";
      if (selectedClass?.type === "class") {
        params.classId = selectedClass?._id;
      } else if (selectedClass?.type === "course") {
        params.courseId = selectedClass?._id;
      }

      const res = await axios.get(`${backend}/module`, {
        params,
      });
      setModules(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedClass) {
      fetchClassModules();
    }
  }, [backend, selectedClass]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const selectedClass = classes.find((cls) => cls._id === selectedId);
    const selectedCourse = courses.find((course) => course._id === selectedId);

    const selectedItem = selectedClass
      ? { ...selectedClass, type: "class" }
      : selectedCourse
      ? { ...selectedCourse, type: "course" }
      : null;

    setSelectedClass(selectedItem);
    setSelectedModule(null);
    setSelectedForm(null); // Reset form selection
  };
  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleId = e.target.value;
    const selectedModule = modules.find((mod) => mod._id === moduleId);
    setSelectedModule(selectedModule || null);
  };

  const handleFormSelect = (
    formType: "liveLink" | "recording" | "material" | "assessment"
  ) => {
    setSelectedForm(formType);
  };

  const handleSubmitLiveLink = async (event: React.FormEvent) => {
    setSubmitting(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const startsAt = (form.elements.namedItem("startsAt") as HTMLInputElement)
      .value;
    const endsAt = (form.elements.namedItem("endsAt") as HTMLInputElement)
      .value;
    const link = (form.elements.namedItem("link") as HTMLInputElement).value;

    const res = await axios.post(`${backend}/live-link/create`, {
      name,
      startsAt,
      endsAt,
      link,
      moduleId: selectedModule?._id,
    });
    console.log(res.data);
    alert("Added Successfully!");
    setSubmitting(false);
  };

  const handleSubmitRecording = async (event: React.FormEvent) => {
    setSubmitting(true);

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    const file = (form.elements.namedItem("link") as HTMLInputElement)
      .files?.[0];
    const formData = new FormData();
    formData.append("name", name);

    if (file) formData.append("link", file);

    // Add moduleId to the formData
    if (selectedModule) {
      formData.append("moduleId", selectedModule._id);
    }

    const res = await axios.post(`${backend}/recording/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    alert("Added Successfully!");
    setSubmitting(false);
  };

  const handleSubmitMaterial = async (event: React.FormEvent) => {
    setSubmitting(true);

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const file = (form.elements.namedItem("content") as HTMLInputElement)
      .files?.[0];
    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("content", file);

    // Add moduleId to the formData
    if (selectedModule) {
      formData.append("moduleId", selectedModule._id);
    }

    const res = await axios.post(`${backend}/material/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    alert("Added Successfully!");
    setSubmitting(false);
  };

  const handleSubmitAssessment = async (event: React.FormEvent) => {
    setSubmitting(true);

    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const type = (form.elements.namedItem("type") as HTMLInputElement).value;
    const file = (form.elements.namedItem("scope") as HTMLInputElement)
      .files?.[0];
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    if (file) formData.append("scope", file);

    // Add moduleId to the formData
    if (selectedModule) {
      formData.append("moduleId", selectedModule._id);
    }

    const res = await axios.post(`${backend}/assessment/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    alert("Added Successfully!");
    setSubmitting(false);
  };

  function isCourse(item: IClass | ICourse | null): item is IClass {
    return item?.type === "course";
  }

  const deleteModule = async (id: string) => {
    try {
      const res = await axios.delete(`${backend}/module/${id}`);

      alert(res.data.message);
      setSelectedModule(null);
      if (selectedClass) fetchClassModules();
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  const toggleVisibility = async (id: string) => {
    if (!selectedModule) {
      alert("Please select a module first!");
      return;
    }
    try {
      const res = await axios.put(`${backend}/module/toggle-visibility/${id}`);
      if (res.status === 200) {
        fetchClassModules();
        setSelectedModule(null);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Add Content</h1>

      {loading && <div>Loading...</div>}

      {/* Class Dropdown */}
      <div className={styles.formGroup}>
        <label htmlFor="class" className={styles.formLabel}>
          Select Class / Course
        </label>
        <select
          id="class"
          className={styles.formInput}
          onChange={handleClassChange}
          value={selectedClass?._id || ""}
        >
          <option value="">Select a Class / Course</option>

          <optgroup label="Classes">
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Courses">
            {courses.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.title}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Module Dropdown */}
      {selectedClass && (
        <div className={styles.formGroup}>
          <label htmlFor="module" className={styles.formLabel}>
            Select Module
          </label>
          <select
            id="module"
            className={styles.formInput}
            onChange={handleModuleChange}
            value={selectedModule?._id || ""}
          >
            <option value="">Select a Module</option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Buttons for Form Selection if selected is course */}

      {selectedModule && isCourse(selectedClass) && (
        <div className={styles.buttonGroup}>
          <button onClick={() => handleFormSelect("recording")}>
            Add Recording
          </button>
        </div>
      )}

      {/* Buttons for Form Selection if selected is class */}
      {selectedModule && !isCourse(selectedClass) && (
        <div className={styles.buttonGroup}>
          <button onClick={() => handleFormSelect("liveLink")}>
            Add Live Link
          </button>
          <button onClick={() => handleFormSelect("recording")}>
            Add Recording
          </button>
          <button onClick={() => handleFormSelect("material")}>
            Add Material
          </button>
          <button onClick={() => handleFormSelect("assessment")}>
            Add Assessment
          </button>
          <button
            id={styles.showHideBtn}
            onClick={() => toggleVisibility(selectedModule._id)}
          >
            {selectedModule.visible ? "Hide Module" : "Show Module"}
          </button>
          <button
            id={styles.deleteBtn}
            onClick={() => deleteModule(selectedModule._id)}
          >
            Delete Module
          </button>
        </div>
      )}

      {/* Conditional Form Rendering */}
      {selectedForm === "liveLink" && (
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
          <input type="url" name="link" placeholder="Live Link URL" required />
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting" : `Submit Live Link`}
          </button>
        </form>
      )}

      {selectedForm === "recording" && (
        <ModuleRecordings
          handleSubmitRecording={handleSubmitRecording}
          moduleId={selectedModule?._id}
          submitting={submitting}
        />
      )}

      {selectedForm === "material" && (
        <ModuleMaterial
          handleSubmitMaterial={handleSubmitMaterial}
          moduleId={selectedModule?._id}
          submitting={submitting}
        />
      )}

      {selectedForm === "assessment" && (
        <ModuleAssessment
          handleSubmitAssessment={handleSubmitAssessment}
          moduleId={selectedModule?._id}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default AddContentForm;
