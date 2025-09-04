import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, IconButton, Grid, CircularProgress } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router';

const EditCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    contentPara1: '',
    contentPara2: '',
    courseModule: [{ heading: '', paragraphs: [{ text: '', _id: '' }] }], // Fixed to match backend
    keyModules: [{ heading: '', paragraph: '' }], // Consider renaming to keyBenefits
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
        // students: '',
        skill_level: '',
        live_project: '',
        projects: ''
        // assessments: '',
        // mode: [] // Default to empty array for mode
      }
    ]
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [Cardimage, setCardimage] = useState(null);
  const [CardimageName, setCardimageName] = useState('');
  const [CardimageUrl, setCardimageUrl] = useState('');
  const [CourseData, setCourseData] = useState(null);
  const [brochureUrl, setbrochureUrl] = useState('');
  const [loading, setLoading] = useState(false); 


  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  const { id } = useParams();

  // Function to extract the image name from the URL
  const getImageNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1]; // Get the last part after the last "/"
  };

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
      setImageName(getImageNameFromUrl(imageUrl)); // Set the image name from the URL
    }
  }, [imageUrl]);

  useEffect(() => {
    if (CardimageUrl) {
      setCardimage(CardimageUrl);
      setCardimageName(getImageNameFromUrl(CardimageUrl)); // Set the image name from the URL
    }
  }, [CardimageUrl]);

  useEffect(() => {
    const fetchCourses = async () => {
      // const token = localStorage.getItem('token');
      // if (token) {
        try {
          const response = await axios.get(`${server}/api/course_module/${id}`, {
            // headers: { Authorization: `Bearer ${token}` }
          });
          const courseData = response.data.course;
          console.log('coursedata?.courseModule', courseData?.courseModule);

          // Set formData with the correct structure
          setFormData({
            ...courseData,
            courseModule: courseData.courseModule?.map((module) => ({
              heading: module.heading || '',
              paragraphs: Array.isArray(module.paragraphs)
                ? module.paragraphs.map((para) => ({
                    text: para.text || '',
                    _id: para._id || ''
                  }))
                : [{ text: '', _id: '' }]
            })) || [{ heading: '', paragraphs: [{ text: '', _id: '' }] }],
            keyModules: courseData.keyBenefits?.map((benefit) => ({
              heading: benefit.heading || '',
              paragraph: benefit.paragraph || ''
            })) || [{ heading: '', paragraph: '' }],
            TrainingOverview: courseData.TrainingOverview?.map((overview) => ({
              // lecture: overview.lecture || '',
              duration: overview.duration || '',
              // language: overview.language || '',
              // students: overview.students || '',
              skill_level: overview.skill_level || '',
              live_project: overview.live_project || '',
              projects: overview?.projects || ''
              // assessments: overview.assessments || '',
              // mode: overview.mode || []
            })) || [
              {
                // lecture: '',
                duration: '',
                // language: '',
                // students: '',
                skill_level: '',
                live_project: '',
                projects: ''
                // assessments: '',
                // mode: []
              }
            ],
            brochure: courseData?.brochure || ''
          });

          setImageUrl(courseData?.image || '');
          setbrochureUrl(courseData?.brochure || ''); // Fixed typo: setbrochureUrl -> setBrochureUrl
          setCardimageUrl(courseData?.Cardimage || '');
          console.log('formData after set:', formData); // Debug to verify state
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      // }
    };
    fetchCourses();
  }, [id]);

  // const handleChange = (e, section, index, paragraphIndex = null) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => {
  //     const updatedFormData = { ...prev };

  //     if (section === 'courseModule') {
  //       if (paragraphIndex !== null) {
  //         updatedFormData.courseModule[index].paragraphs[paragraphIndex].text = value; // Update paragraph text
  //       } else {
  //         updatedFormData.courseModule[index].heading = value; // Update heading
  //       }
  //     } else {
  //       const updatedSection = [...prev[section]];
  //       if (paragraphIndex !== null) {
  //         updatedSection[index].paragraph[paragraphIndex] = value;
  //       } else {
  //         updatedSection[index][name] = value;
  //       }
  //       updatedFormData[section] = updatedSection;
  //     }

  //     return updatedFormData;
  //   });
  // };

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
      } else if (section === 'TrainingOverview') {
        const updatedTrainingOverview = [...prev.TrainingOverview];
        updatedTrainingOverview[index] = {
          ...updatedTrainingOverview[index],
          [name]: value,
        };
        updatedFormData.TrainingOverview = updatedTrainingOverview;
      } else {
        const updatedSection = [...prev[section]];
        if (paragraphIndex !== null) {
          updatedSection[index].paragraph[paragraphIndex] = value;
        } else {
          updatedSection[index][name] = value;
        }
        updatedFormData[section] = updatedSection;
      }
  
      return updatedFormData;
    });
  };

  // Add a new course module
  const addField = (field) => {
    if (field === 'courseModule') {
      setFormData({
        ...formData,
        courseModule: [...formData.courseModule, { heading: '', paragraphs: [{ text: '', _id: '' }] }]
      });
    }
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { heading: '', paragraph: [''] }]
    }));
  };

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
      setImage(URL.createObjectURL(file)); // Show image preview
      setImageName(file.name);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle image change
  const handleCardimageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCardimage(URL.createObjectURL(file)); // Show image preview
      setCardimageName(file.name);
      setFormData((prev) => ({ ...prev, Cardimage: file }));
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('contentPara1', formData.contentPara1);
    data.append('contentPara2', formData.contentPara2);
    data.append('courseOverview', formData.courseOverview);
    data.append('TrainingOverview', JSON.stringify(formData.TrainingOverview)); // Stringify the array
    console.log('formdata dkeh0-->',formData)
    data.append('pageHeader', formData.pageHeader);

    // Prepare courseModule data
    const courseModuleData = formData.courseModule.map((module) => ({
      heading: module.heading,
      paragraphs: module.paragraphs.map((para) => ({ text: para.text }))
    }));
    data.append('courseModule', JSON.stringify(courseModuleData));

    // Prepare keyBenefits data (renamed from keyModules)
    const keyBenefitsData = formData.keyModules.map((benefit) => ({
      heading: benefit.heading,
      paragraph: benefit.paragraph
    }));
    data.append('keyBenefits', JSON.stringify(keyBenefitsData));

    // Append file uploads
    if (formData.image) {
      data.append('image', formData.image);
    }
    if (formData.Cardimage) {
      data.append('Cardimage', formData.Cardimage);
    }
    if (formData.brochure) {
      data.append('brochure', formData.brochure);
    }
    setLoading(true);


    try {
      const response = await axios.put(`${server}/api/course_module/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${localStorage.getItem('token')}` // Add token if required
        }
      });

      toast('Course Updated Successfully!');
      // navigate('/apps/allcourses');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Error updating course!');
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Update Course</h2>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <label htmlFor="pageHeader">Page Header:</label>
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
        <div>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Content Paragraph 1 */}
        <div>
          <TextField
            label="Content Paragraph 1"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentPara1"
            value={formData.contentPara1}
            onChange={(e) => setFormData({ ...formData, contentPara1: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Content Paragraph 2 */}

        <div>
          <TextField
            label="Content Paragraph 2"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentPara2"
            value={formData.contentPara2}
            onChange={(e) => setFormData({ ...formData, contentPara2: e.target.value })}
            className="mb-6 w-full"
          />
        </div>

        {/* Course Overview */}
        <div>
          <TextField
            label="Course Overview"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="courseOverview"
            value={formData.courseOverview}
            onChange={(e) => setFormData({ ...formData, courseOverview: e.target.value })}
            className="mb-6 w-full"
          />
        </div>

        {/* Training Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Training Overview</h3>
          {formData.TrainingOverview.map((overview, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <Grid container spacing={3}>
                  {/* Duration Field */}
                  <Grid item xs={3}>
                    <InputLabel className="mb-2">Duration</InputLabel>
                    <TextField
                      // label={`Duration`}
                      variant="outlined"
                      fullWidth
                      name="duration"
                      value={overview.duration}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  {/* Skill Level Field */}
                  <Grid item xs={3}>
                    <InputLabel className="mb-2">Skill Level</InputLabel>
                    <TextField
                      // label={`Skill Level`}
                      variant="outlined"
                      fullWidth
                      name="skill_level"
                      value={overview.skill_level}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  {/* Live Project Field */}
                  <Grid item xs={3}>
                    <InputLabel className="mb-2">Live Project</InputLabel>
                    <TextField
                      // label={`Live Project`}
                      variant="outlined"
                      fullWidth
                      name="live_project"
                      value={overview.live_project}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <InputLabel className="mb-2">Projects</InputLabel>
                    <TextField
                      // label={`Projects`}
                      variant="outlined"
                      fullWidth
                      name="projects"
                      value={overview.projects}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          ))}
        </div>

        {/* // Course Modules section in the return statement */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Course Modules</h3>
          {formData?.courseModule?.map((module, index) => (
            <div key={module._id || index} className="space-y-4 mb-6 border p-4 rounded-lg">
              {/* Module Heading */}
              <div className="flex items-center space-x-4">
                <TextField
                  label={`Module ${index + 1} Heading`}
                  variant="outlined"
                  fullWidth
                  name="heading"
                  value={module.heading || ''}
                  onChange={(e) => handleChange(e, 'courseModule', index)}
                  className="w-full"
                />
                {formData.courseModule.length > 1 && (
                  <IconButton onClick={() => removeField('courseModule', index)} color="error" title="Remove Module">
                    <RemoveCircle />
                  </IconButton>
                )}
              </div>

              {/* Paragraphs */}
              <div className="space-y-4">
                {module?.paragraphs?.map((paragraph, paragraphIndex) => (
                  <div key={paragraph._id || `${index}-${paragraphIndex}`} className="flex items-start space-x-4">
                    <TextField
                      label={`Paragraph ${paragraphIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={paragraph.text || ''}
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

              {/* Add Paragraph Button */}
              <Button variant="text" color="primary" startIcon={<AddCircle />} onClick={() => addParagraph(index)} className="mt-2">
                Add Paragraph
              </Button>
            </div>
          ))}

          {/* Add Module Button */}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('courseModule')} className="mt-4">
            Add Course Module
          </Button>
        </div>
        {/* // ... (rest of the component remains the same) */}
        {/* Image Upload */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image</h2>
        <div className="flex items-center gap-6">
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {image ? (
              <img src={image} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
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

        {/* Upload Card Image */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Card Image</h2>

        <div className="flex items-center gap-6">
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {Cardimage ? (
              <img src={Cardimage} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
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

        {/* Upload Brochure */}
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
                // Generate brochureUrl (assuming it's a URL to the file you want to show)
                const url = URL.createObjectURL(file);
                setbrochureUrl(url); // Assuming you have setBrochureUrl to update the brochureUrl
              }}
              className="mt-2 w-full px-4 py-4 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* {formData.brochure && <p className="mt-1 text-sm text-gray-500">{formData.brochure.name}</p>} */}

            {brochureUrl && (
              <button
                className="bg-blue-600 px-8 py-5 flex justify-center items-center text-white mt-1"
                onClick={() => window.open(brochureUrl, '_blank')} // Opens the brochureUrl in a new tab
              >
                View
              </button>
            )}

            {console.log('brochure-->', brochureUrl)}
          </div>
        </div>

        {/* Key Benefits */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Key Benefits</h3>
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
                <IconButton onClick={() => removeField('keyModules', index)} color="error">
                  <RemoveCircle />
                </IconButton>
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
        <Button onClick={handleSubmit}   disabled={loading}  fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          {/* Update Course */}
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Course"}
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

export default EditCourse;
