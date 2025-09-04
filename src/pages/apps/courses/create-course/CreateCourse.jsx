import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, IconButton, Grid, CircularProgress } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    contentPara1: '',
    contentPara2: '',
    courseModule: [{ heading: '', paragraphs: [{ text: '', _id: '' }] }],
    keyModules: [{ heading: '', paragraph: '' }],
    image: null,
    Cardimage: null,
    brochure: null,
    pageHeader: '',
    courseOverview: '',
    TrainingOverview: [
      {
        // lecture: '',
        duration: '',
        // language: '',
        // students: '', // Will be converted to number on input
        skill_level: '',
        live_project: '',
        projects: '',
        // mode: [],
      },
    ],
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [Cardimage, setCardimage] = useState(null);
  const [CardimageName, setCardimageName] = useState('');
  const [brochureUrl, setBrochureUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 


  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  // Handle input changes
  const handleChange = (e, section, index, paragraphIndex = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev };

      if (section === 'courseModule') {
        if (paragraphIndex !== null) {
          updatedFormData.courseModule[index].paragraphs[paragraphIndex].text = value;
        } else {
          updatedFormData.courseModule[index].heading = value;
        }
      } else if (section) {
        const updatedSection = [...prev[section]];
        if (paragraphIndex !== null) {
          updatedSection[index].paragraph = value; // For keyModules
        } else {
          // Convert students to a number
          if (name === 'students') {
            updatedSection[index][name] = value === '' ? '' : Number(value); // Keep as empty string if cleared, else convert to number
          } else {
            updatedSection[index][name] = value;
          }
        }
        updatedFormData[section] = updatedSection;
      } else {
        updatedFormData[name] = value;
      }

      return updatedFormData;
    });

    // Clear error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [`${section}-${index}-${name}`]: '',
    }));
  };

  // Add a new field
  const addField = (field) => {
    if (field === 'courseModule') {
      setFormData({
        ...formData,
        courseModule: [...formData.courseModule, { heading: '', paragraphs: [{ text: '', _id: '' }] }],
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], { heading: '', paragraph: '' }],
      }));
    }
  };

  // Remove a field
  const removeField = (section, index) => {
    setFormData((prev) => {
      const updatedSection = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: updatedSection };
    });
  };

  // Add a new paragraph to a module
  const addParagraph = (moduleIndex) => {
    const updatedModules = [...formData.courseModule];
    updatedModules[moduleIndex].paragraphs.push({ text: '', _id: '' });
    setFormData({ ...formData, courseModule: updatedModules });
  };

  // Remove a paragraph from a module
  const removeParagraph = (moduleIndex, paragraphIndex) => {
    const updatedModules = [...formData.courseModule];
    updatedModules[moduleIndex].paragraphs = updatedModules[moduleIndex].paragraphs.filter((_, i) => i !== paragraphIndex);
    setFormData({ ...formData, courseModule: updatedModules });
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle card image change
  const handleCardimageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCardimage(URL.createObjectURL(file));
      setCardimageName(file.name);
      setFormData((prev) => ({ ...prev, Cardimage: file }));
    }
  };

  // Validate TrainingOverview
  const validateTrainingOverview = () => {
    const requiredFields = [
      'duration',
    
      'skill_level',
      'live_project',
      'projects',
    ];
    let isValid = true;
    const newErrors = {};

    formData.TrainingOverview.forEach((overview, index) => {
      requiredFields.forEach((field) => {
        const value = overview[field];
        if (field === 'students') {
          if (value === '' || isNaN(value) || value < 0) {
            newErrors[`TrainingOverview-${index}-students`] = 'Students must be a valid positive number';
            isValid = false;
          }
        } else if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[`TrainingOverview-${index}-${field}`] = `${field.replace('_', ' ')} is required`;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

const validation = async () => {
  // Start with a flag to track if validation has failed
  let validationFailed = false;

  // General required fields to check
  const requiredFields = [
    'title',
    'contentPara1',
    'contentPara2',
    'courseOverview',
    'TrainingOverview',
    'pageHeader'
  ];

  // Check if any required general fields are missing
  for (let field of requiredFields) {
    if (!formData[field]) {
      toast.error('Please, enter the required fields');
      validationFailed = true; // Mark validation as failed
      break; // Stop further checks after the first missing required field
    }
  }

  // Check if keyModules is provided and validate them
  if (formData.keyModules && formData.keyModules.length > 0) {
    // Check if any keyModule is missing a heading or paragraph
    const invalidKeyModules = formData.keyModules.some((benefit) => !benefit.heading || !benefit.paragraph);

    if (invalidKeyModules) {
      toast.error('Oops!, Please Enter Heading and Paragraph for Each key module');
      validationFailed = true; // Mark validation as failed
    }
  }

  // If validation failed at any point, return early
  if (validationFailed) return;
  
  // Proceed with further logic if all fields are validated
};



  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validation()){
      toast.error('Please, Enter the required fields')
    }

    if (!validateTrainingOverview()) {
      toast.error('Please fill all required fields in Training Overview with valid values!');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('contentPara1', formData.contentPara1);
    data.append('contentPara2', formData.contentPara2);
    data.append('courseOverview', formData.courseOverview);
    data.append('TrainingOverview', JSON.stringify(formData.TrainingOverview));
    data.append('pageHeader', formData.pageHeader);

    const courseModuleData = formData.courseModule.map((module) => ({
      heading: module.heading,
      paragraphs: module.paragraphs.map((para) => ({ text: para.text })),
    }));
    data.append('courseModule', JSON.stringify(courseModuleData));

    const keyBenefitsData = formData.keyModules.map((benefit) => ({
      heading: benefit.heading,
      paragraph: benefit.paragraph,
    }));
    data.append('keyBenefits', JSON.stringify(keyBenefitsData));

    if (formData.image) data.append('image', formData.image);
    if (formData.Cardimage) data.append('Cardimage', formData.Cardimage);
    if (formData.brochure) data.append('brochure', formData.brochure);
    setLoading(true);


    try {
      const response = await axios.post(`${server}/api/course_module/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Course Created Successfully!');
      navigate('/apps/allcourses');
    } catch (error) {
      console.error('Error creating course:', error?.response?.data?.message);
       const capitalizedMessage = error?.response?.data?.message?.charAt(0).toUpperCase() + error?.response?.data?.message?.slice(1);

  // toast.error(capitalizedMessage);
  //     toast.error(error?.response?.data?.message);
    }

    finally {
    setLoading(false); // 🔥 Stop loading
  }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Create New Course</h2>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <label htmlFor="pageHeader">Page Header * :</label>
          <select
            id="pageHeader"
            name="pageHeader"
            value={formData.pageHeader}
            onChange={(e) => setFormData({ ...formData, pageHeader: e.target.value })}
          >
            <option value="">Select an option</option>
            <option value="skill_development">Skill Development</option>
            <option value="career_development">Career Development</option>
          </select>
        </div>

        {/* Title */}
        <TextField
          label="Title *"
          variant="outlined"
          fullWidth
          name="title"
          value={formData.title}
          onChange={(e) => handleChange(e)}
          className="mb-4 w-full"
        />

        {/* Content Paragraph 1 */}
        <TextField
          label="Content Paragraph 1 *"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          name="contentPara1"
          value={formData.contentPara1}
          onChange={(e) => handleChange(e)}
          className="mb-4 w-full"
        />

        {/* Content Paragraph 2 */}
        <TextField
          label="Content Paragraph 2 *"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          name="contentPara2"
          value={formData.contentPara2}
          onChange={(e) => handleChange(e)}
          className="mb-6 w-full"
        />

        {/* Course Overview */}
        <TextField
          label="Course Overview *"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          name="courseOverview"
          value={formData.courseOverview}
          onChange={(e) => handleChange(e)}
          className="mb-6 w-full"
        />

        {/* Training Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Training Overview *</h3>
          {formData.TrainingOverview.map((overview, index) => (
            <div key={index} className="space-y-4 mb-4">
              <Grid container spacing={3}>
             
                <Grid item xs={3}>
                  <TextField
                    label="Duration"
                    variant="outlined"
                    fullWidth
                    name="duration"
                    value={overview.duration}
                    onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                    error={!!errors[`TrainingOverview-${index}-duration`]}
                    helperText={errors[`TrainingOverview-${index}-duration`]}
                  />
                </Grid>
              
            
                <Grid item xs={3}>
                  <TextField
                    label="Skill Level"
                    variant="outlined"
                    fullWidth
                    name="skill_level"
                    value={overview.skill_level}
                    onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                    error={!!errors[`TrainingOverview-${index}-skill_level`]}
                    helperText={errors[`TrainingOverview-${index}-skill_level`]}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Live Project"
                    variant="outlined"
                    fullWidth
                    name="live_project"
                    value={overview.live_project}
                    onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                    error={!!errors[`TrainingOverview-${index}-live_project`]}
                    helperText={errors[`TrainingOverview-${index}-live_project`]}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Projects"
                    variant="outlined"
                    fullWidth
                    name="projects"
                    value={overview.projects}
                    onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                    error={!!errors[`TrainingOverview-${index}-projects`]}
                    helperText={errors[`TrainingOverview-${index}-projects`]}
                  />
                </Grid>
               
              </Grid>
            </div>
          ))}
        </div>

        {/* Course Modules */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Course Modules *</h3>
          {formData.courseModule.map((module, index) => (
            <div key={index} className="space-y-4 mb-6 border p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <TextField
                  label={`Module ${index + 1} Heading`}
                  variant="outlined"
                  fullWidth
                  name="heading"
                  value={module.heading}
                  onChange={(e) => handleChange(e, 'courseModule', index)}
                  className="w-full"
                />
                {formData.courseModule.length > 1 && (
                  <IconButton onClick={() => removeField('courseModule', index)} color="error" title="Remove Module">
                    <RemoveCircle />
                  </IconButton>
                )}
              </div>

              <div className="space-y-4">
                {module.paragraphs.map((paragraph, paragraphIndex) => (
                  <div key={paragraphIndex} className="flex items-start space-x-4">
                    <TextField
                      label={`Paragraph ${paragraphIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={paragraph.text}
                      onChange={(e) => handleChange(e, 'courseModule', index, paragraphIndex)}
                      className="w-full"
                    />
                    {module.paragraphs.length > 1 && (
                      <IconButton onClick={() => removeParagraph(index, paragraphIndex)} color="error" title="Remove Paragraph">
                        <RemoveCircle />
                      </IconButton>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="text" color="primary" startIcon={<AddCircle />} onClick={() => addParagraph(index)} className="mt-2">
                Add Paragraph
              </Button>
            </div>
          ))}

          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('courseModule')} className="mt-4">
            Add Course Module
          </Button>
        </div>

        {/* Image Upload */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {image ? (
              <img src={image} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>
          <div className="flex-1">
            <TextField
              label="Image Name"
              variant="outlined"
              value={imageName}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-input-1" />
            <label
              htmlFor="file-input-1"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        {/* Card Image Upload */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Card Image</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {Cardimage ? (
              <img src={Cardimage} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>
          <div className="flex-1">
            <TextField
              label="Card Image Name"
              variant="outlined"
              value={CardimageName}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
            <input type="file" accept="image/*" onChange={handleCardimageChange} className="hidden" id="file-input-2" />
            <label
              htmlFor="file-input-2"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Card Image
            </label>
          </div>
        </div>

        {/* Brochure Upload */}
        <div className="mb-4">
          <label htmlFor="brochure" className="block text-sm font-medium text-gray-700">
            Upload Brochure
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="brochure"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, brochure: file });
                setBrochureUrl(URL.createObjectURL(file));
              }}
              className="mt-2 w-full px-4 py-4 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {brochureUrl && (
              <button
                className="bg-blue-600 px-8 py-5 flex justify-center items-center text-white mt-1"
                onClick={() => window.open(brochureUrl, '_blank')}
              >
                View
              </button>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Key Benefits *</h3>
          {formData.keyModules.map((keyBenefit, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <TextField
                  label={`Key Benefit ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  name="heading"
                  value={keyBenefit.heading}
                  onChange={(e) => handleChange(e, 'keyModules', index)}
                  className="mb-2 w-full"
                />
                {formData.keyModules.length > 1 && (
                  <IconButton onClick={() => removeField('keyModules', index)} color="error">
                    <RemoveCircle />
                  </IconButton>
                )}
              </div>
              <TextField
                label={`Key Benefit ${index + 1} Description`}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="paragraph"
                value={keyBenefit.paragraph}
                onChange={(e) => handleChange(e, 'keyModules', index)}
                className="mb-6 w-full"
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('keyModules')} className="mb-6">
            Add Key Benefit
          </Button>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={loading}  fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          {/* Create Course */}
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Course"}
        </Button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CreateCourse;