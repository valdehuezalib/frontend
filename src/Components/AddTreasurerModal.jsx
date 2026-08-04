import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

function AddTreasurerModal({
    open,
    onClose,
    onSave,
    selectedTreasurer,
}) {

    const [formData, setFormData] = useState({
        username: "",
        passwordHash: "",
        department: "",
        role: "Treasurer",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {

        if (!open) return;

        if (selectedTreasurer) {

            setFormData({
                username: selectedTreasurer.username,
                passwordHash: "",
                department: selectedTreasurer.department,
                role: selectedTreasurer.role,
            });

        } else {

            setFormData({
                username: "",
                passwordHash: "",
                department: "",
                role: "Treasurer",
            });

        }

    }, [open, selectedTreasurer]);

    if (!open) return null;

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    }



            function submit(e) {

            e.preventDefault();

            const newErrors = {};

            if (!formData.username.trim()) {
                newErrors.username = "Username is required.";
            }

            if (!selectedTreasurer && !formData.passwordHash.trim()) {
                newErrors.passwordHash = "Password is required.";
            }

            if (!formData.department) {
                newErrors.department = "Select a department.";
            }

            if (!formData.role) {
                newErrors.role = "Select a role.";
            }

            setErrors(newErrors);

            if (Object.keys(newErrors).length > 0) return;

            onSave(formData);
        }

    return (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-full max-w-lg">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-green-900">

                        {selectedTreasurer
                            ? "Edit Treasurer"
                            : "Add Treasurer"}

                    </h2>

                    <button onClick={onClose}>
                        <FiX size={22}/>
                    </button>

                </div>

                <form onSubmit={submit}>

                    <input
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 mb-4"
                    />

                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.username}
                        </p>
                    )}

                    <input
                        type="password"
                        name="passwordHash"
                        placeholder={
                            selectedTreasurer
                                ? "Leave blank to keep password"
                                : "Password"
                        }
                        value={formData.passwordHash}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 mb-4"
                    />

                    {errors.passwordHash && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.passwordHash}
                        </p>
                    )}

                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 mb-4"
                    >
                        <option value="">Select Department</option>

                        <option value="College of Computer Studies (CCS)">
                            College of Computer Studies (CCS)
                        </option>

                        <option value="Bachelor of Science in Nursing (BSN)">
                            Bachelor of Science in Nursing (BSN)
                        </option>

                        <option value="Bachelor of Science in Midwifery (BSM)">
                            Bachelor of Science in Midwifery (BSM)
                        </option>

                        <option value="Bachelor of Science in Radiologic Technology (BSRT)">
                            Bachelor of Science in Radiologic Technology (BSRT)
                        </option>

                        <option value="Bachelor of Science in Medical Technology (BSMT)">
                            Bachelor of Science in Medical Technology (BSMT)
                        </option>

                        <option value="Doctor of Medicine (MED)">
                            Doctor of Medicine (MED)
                        </option>

                        <option value="Bachelor of Science in Pharmacy (PHARMA)">
                            Bachelor of Science in Pharmacy (PHARMA)
                        </option>

                        <option value="Bachelor of Secondary Education & Elementary Education (BSED)">
                            Bachelor of Secondary Education & Elementary Education (BSED)
                        </option>

                        <option value="Bachelor of Science in Hospitality Management (BSHM)">
                            Bachelor of Science in Hospitality Management (BSHM)
                        </option>

                        <option value="Bachelor of Science in Physical Therapy (BSPT)">
                            Bachelor of Science in Physical Therapy (BSPT)
                        </option>

                        <option value="Bachelor of Science in Accountancy & Business Administration (BSA/BA)">
                            Bachelor of Science in Accountancy & Business Administration (BSA/BA)
                        </option>

                        <option value="Admin">
                            Admin
                        </option>
                    </select>

                    {errors.department && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.department}
                        </p>
                    )}

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 mb-6"
                    >

                        <option>Treasurer</option>
                        <option>Admin</option>

                    </select>

                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.role}
                        </p>
                    )}

                    <button
                        className="bg-green-900 text-white rounded-xl w-full py-3"
                    >

                        {selectedTreasurer
                            ? "Update Treasurer"
                            : "Save Treasurer"}

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddTreasurerModal;