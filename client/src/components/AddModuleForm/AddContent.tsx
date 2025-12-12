import { useState, useEffect, useCallback } from "react";
import styles from "./AddContent.module.css";
import IClass from "../../interfaces/IClass";
import IModule from "../../interfaces/IModule";
import { useUserStore } from "../../store";
import axios, { AxiosError } from "axios";
import ICourse from "../../interfaces/ICourse";
import ModuleRecordings from "./ModuleRecordings";
import ModuleMaterial from "./ModuleMaterial";
import ModuleAssessment from "./ModuleAssessment";
import ModuleLiveLink from "./ModuleLiveLink";
import ICohort from "../../interfaces/ICohort";

const AddContentForm = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingModules, setLoadingModules] = useState<boolean>(false);
  const [loadingCohorts, setLoadingCohorts] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingCohort, setSubmittingCohort] = useState<boolean>(false);

  const [classes, setClasses] = useState<IClass[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [modules, setModules] = useState<IModule[]>([]);
  const [cohorts, setCohorts] = useState<ICohort[]>([]);

  const [selectedClass, setSelectedClass] = useState<IClass | ICourse | null>(
    null
  );
  const [selectedModule, setSelectedModule] = useState<IModule | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<ICohort | null>(null);

  const [selectedForm, setSelectedForm] = useState<
    "liveLink" | "recording" | "material" | "assessment" | null
  >(null);

  const [moduleName, setModuleName] = useState<string | null>(null);
  const [moduleIndex, setModuleIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [cohortName, setCohortName] = useState<string | null>(null);
  const [cohortDefault, setCohortDefault] = useState<boolean | undefined>(
    undefined
  );
  const [isEditCohortModalOpen, setIsEditCohortModalOpen] =
    useState<boolean>(false);

  const [viewCohortModules, setViewCohortModules] = useState<boolean>(false);

  const openEditModal = () => {
    setModuleIndex(selectedModule?.index ?? null);
    setModuleName(selectedModule?.name ?? null);
    setIsEditModalOpen((prev) => !prev);
  };

  const openEditCohort = () => {
    setCohortName(selectedCohort?.name ?? null);
    setCohortDefault(selectedCohort?.isDefault ?? undefined);
    setIsEditCohortModalOpen((prev) => !prev);
  };

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

  const fetchClassCohorts = useCallback(async () => {
    if (selectedClass?.type === "course") return;
    try {
      setLoadingCohorts(true);

      const res = await axios.get(
        `${backend}/cohort/class-cohorts/${selectedClass?._id}`
      );
      setCohorts(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCohorts(false);
    }
  }, [backend, selectedClass]);

  // Fetch modules based on selected class
  const fetchClassModules = useCallback(async () => {
    try {
      setLoadingModules(true);

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
      setLoadingModules(false);
    }
  }, [backend, selectedClass, user]);

  useEffect(() => {
    if (selectedClass) {
      fetchClassCohorts();
      fetchClassModules();
    }
  }, [backend, selectedClass, fetchClassModules, fetchClassCohorts]);

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
    setSelectedCohort(null);
    setSelectedForm(null); // Reset form selection
  };
  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleId = e.target.value;
    const selectedModule = modules.find((mod) => mod._id === moduleId);
    setSelectedModule(selectedModule || null);
  };

  const handleCohortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cohortId = e.target.value;
    const selectedCohort = cohorts.find((coho) => coho._id === cohortId);
    setSelectedCohort(selectedCohort || null);
  };

  const handleFormSelect = (
    formType: "liveLink" | "recording" | "material" | "assessment"
  ) => {
    setSelectedForm(formType);
  };

  // TODO: Remove this function
  // const handleSubmitLiveLink = async (event: React.FormEvent) => {
  //   setSubmitting(true);
  //   event.preventDefault();
  //   const form = event.target as HTMLFormElement;
  //   const name = (form.elements.namedItem("name") as HTMLInputElement).value;
  //   const startsAt = (form.elements.namedItem("startsAt") as HTMLInputElement)
  //     .value;
  //   const endsAt = (form.elements.namedItem("endsAt") as HTMLInputElement)
  //     .value;
  //   const link = (form.elements.namedItem("link") as HTMLInputElement).value;
  //   const timeZone = (form.elements.namedItem("timeZone") as HTMLSelectElement)
  //     .value;

  //   await axios.post(`${backend}/live-link/create`, {
  //     name,
  //     startsAt,
  //     endsAt,
  //     link,
  //     timeZone,
  //     moduleId: selectedModule?._id,
  //   });
  //   alert("Added Successfully!");
  //   setSubmitting(false);
  // };
  // TODO: Remove this function
  // const handleSubmitRecording = async (event: React.FormEvent) => {
  //   setSubmitting(true);

  //   event.preventDefault();
  //   const form = event.target as HTMLFormElement;
  //   const name = (form.elements.namedItem("name") as HTMLInputElement).value;

  //   const file = (form.elements.namedItem("link") as HTMLInputElement)
  //     .files?.[0];
  //   const formData = new FormData();
  //   formData.append("name", name);

  //   if (file) formData.append("link", file);

  //   // Add moduleId to the formData
  //   if (selectedModule) {
  //     formData.append("moduleId", selectedModule._id);
  //   }

  //   const res = await axios.post(`${backend}/recording/create`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   console.log(res.data);
  //   alert("Added Successfully!");
  //   setSubmitting(false);
  // };

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

  const editModule = async () => {
    if (!selectedModule) {
      alert("Please select a module first!");
      return;
    }
    try {
      const res = await axios.patch(
        `${backend}/module/edit-module/${selectedModule._id}`,
        {
          name: moduleName,
          index: moduleIndex,
        }
      );
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

  const editCohort = async () => {
    setSubmittingCohort(true);
    if (!selectedCohort) {
      alert("Please select a cohort first!");
      return;
    }
    try {
      const res = await axios.patch(
        `${backend}/cohort/edit/${selectedCohort._id}`,
        {
          name: cohortName,
          isDefault: cohortDefault,
        }
      );
      if (res.status === 200) {
        fetchClassCohorts();
        setSelectedCohort(null);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    } finally {
      setSubmittingCohort(false);
    }
  };

  const addModuleToCohort = async () => {
    if (!selectedCohort) {
      alert("please select a cohort first");
      return;
    }
    if (!selectedModule) {
      alert("please select a module first");
      return;
    }

    const res = await axios.patch(
      `${backend}/module/toggle-cohort-visibility/${selectedModule._id}`,
      {
        cohortId: selectedCohort._id,
      }
    );

    if (res.status === 200) {
      fetchClassCohorts();
      fetchClassModules();
      setSelectedModule(null);
      setSelectedCohort(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Add Content</h1>

      {loading && <div>Loading...</div>}

      {/* Class Dropdown */}
      {!loading && (
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
      )}

      {/* Cohort Dropdown */}
      {!loadingCohorts && selectedClass && (
        <div className={styles.formGroup}>
          <label htmlFor="cohort" className={styles.formLabel}>
            Select Cohort
          </label>
          <select
            id="cohort"
            className={styles.formInput}
            onChange={handleCohortChange}
            value={selectedCohort?._id || ""}
          >
            <option value="">Select a Cohort</option>
            {cohorts.map((cohort) => (
              <option key={cohort._id} value={cohort._id}>
                {cohort.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCohort && (
        <div className={styles.buttonGroup}>
          <button onClick={openEditCohort}>Edit Cohort</button>
        </div>
      )}

      {isEditCohortModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <form
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90vw",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              editCohort();
              setIsEditCohortModalOpen(false);
            }}
          >
            <label className={styles.formLabel}>
              Name
              <input
                className={styles.formInput}
                style={{ direction: "ltr" }}
                type="text"
                value={cohortName ?? selectedCohort?.name}
                onChange={(e) => setCohortName(e.target.value)}
              />
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 500,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              Default:
              <span
                style={{
                  position: "relative",
                  width: "46px",
                  height: "24px",
                  display: "inline-block",
                }}
              >
                <input
                  type="checkbox"
                  checked={cohortDefault}
                  onChange={(e) => setCohortDefault(e.target.checked)}
                  style={{
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: cohortDefault ? "var(--primary-blue)" : "#ccc",
                    borderRadius: "24px",
                    transition: "0.25s",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    height: "18px",
                    width: "18px",
                    left: cohortDefault ? "25px" : "3px",
                    bottom: "3px",
                    background: "white",
                    borderRadius: "50%",
                    transition: "0.25s",
                  }}
                />
              </span>
            </label>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                style={{ backgroundColor: "var(--primary-beige)" }}
                onClick={() => setIsEditCohortModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit">
                {submittingCohort ? "submitting" : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Module Dropdown */}
      {!loadingModules && selectedClass && (
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
          <button onClick={() => openEditModal()}>Edit Module</button>
          <button
            id={styles.showHideBtn}
            onClick={() => toggleVisibility(selectedModule._id)}
          >
            {selectedModule.visible ? "Hide Module" : "Show Module"}
          </button>
          <button
            style={{ backgroundColor: "var(--primary-beige)" }}
            onClick={() => setViewCohortModules(true)}
          >
            View Cohorts
          </button>
          {selectedModule && selectedCohort && (
            <button
              style={{ backgroundColor: "var(--primary-beige)" }}
              onClick={addModuleToCohort}
            >
              {selectedModule.cohortVisible.some(
                (c) => c._id === selectedCohort?._id
              )
                ? "Remove Cohort"
                : "Add Cohort"}
            </button>
          )}
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
        <ModuleLiveLink selectedModule={selectedModule} />
      )}

      {selectedForm === "recording" && (
        <ModuleRecordings
          // handleSubmitRecording={handleSubmitRecording}
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

      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <form
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90vw",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              editModule();
              setIsEditModalOpen(false);
            }}
          >
            <label className={styles.formLabel}>
              Name
              <input
                className={styles.formInput}
                style={{ direction: "ltr" }}
                type="text"
                value={moduleName ?? selectedModule?.name}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </label>

            <label className={styles.formLabel}>
              Index
              <input
                type="number"
                className={styles.formInput}
                style={{ direction: "ltr" }}
                value={moduleIndex ?? selectedModule?.index}
                onChange={(e) => setModuleIndex(parseInt(e.target.value))}
              />
            </label>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                style={{ backgroundColor: "var(--primary-beige)" }}
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit">Confirm</button>
            </div>
          </form>
        </div>
      )}

      {viewCohortModules && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90vw",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxHeight: "480px",
              overflow: "auto",
            }}
          >
            {!selectedModule?.cohortVisible ||
            selectedModule?.cohortVisible.length === 0 ? (
              <p>no cohorts are visible for this module</p>
            ) : (
              selectedModule?.cohortVisible.map((item: ICohort) => (
                <p key={item._id}>{item.name}</p>
              ))
            )}

            <div className={styles.buttonGroup}>
              {" "}
              <button onClick={() => setViewCohortModules(false)}>
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddContentForm;
