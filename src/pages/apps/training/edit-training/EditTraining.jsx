import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, IconButton, Grid } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const EditTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    Trainingtitle: '',
    trainingName: '',
    contentParagraph1: '',
    contentParagraph2: '',
    contentParagraph3: '',
    brochure: null,
    QnAContent: [{ question: '', answer: '' }],
    TrainingOverview: [
      {
        lecture: '',
        duration: '',
        language: '',
        students: '',
        skill_level: '',
        live_project: '',
        assessments: '',
        mode: ''
      }
    ],
    FeeStructure: [{ course: '', lastPrice: '', currentPrice: '' }],
    pageHeader: '',
    Skills: [
      {
        skillName: '',
        skillDetails: [
          {
            SkillTopicHeader: '',
            SkillsSubHeadings: ['']
          }
        ]
      }
    ]
  });

  const [image1, setImage1] = useState(null); // For File object (new upload)
  const [image2, setImage2] = useState(null); // For File object (new upload)
  const [image3, setImage3] = useState(null); // For File object (new upload)
  const [Cardimage, setCardimage] = useState(null);

  const [imageUrl1, setImageUrl1] = useState(null); // For displaying existing image
  const [imageUrl2, setImageUrl2] = useState(null); // For displaying existing image
  const [imageUrl3, setImageUrl3] = useState(null); // For displaying existing image
  const [CardimageUrl, setCardimageUrl] = useState(null);

  const [imageName1, setImageName1] = useState('');
  const [imageName2, setImageName2] = useState('');
  const [imageName3, setImageName3] = useState('');
  const [CardimageName, setCardimageName] = useState('');
  const [brochureUrl, setbrochureUrl] = useState('');

  // Fetch training data
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(`${server}/api/trainings/${id}`);
        const data = response.data?.training;
        console.log('API Response:', data);

        const updatedFormData = {
          Trainingtitle: data.Trainingtitle || '',
          trainingName: data.trainingName || '',
          contentParagraph1: data.contentPara1 || data.contentParagraph1 || '',
          contentParagraph2: data.contentPara2 || data.contentParagraph2 || '',
          contentParagraph3: data.contentPara3 || data.contentParagraph3 || '',
          QnAContent: data.QnAContent?.length > 0 ? data.QnAContent : [{ question: '', answer: '' }],
          brochure: data?.brochure || null,
          TrainingOverview:
            data.TrainingOverview?.length > 0
              ? data.TrainingOverview
              : [
                  {
                    lecture: '',
                    duration: '',
                    language: '',
                    students: '',
                    skill_level: '',
                    live_project: '',
                    assessments: '',
                    mode: ''
                  }
                ],
          FeeStructure: data.FeeStructure?.length > 0 ? data.FeeStructure : [{ course: '', lastPrice: '', currentPrice: '' }],
          pageHeader: data.pageHeader || 'industrial-development',
          Skills:
            data.skills?.length > 0
              ? data.skills.map((skill) => ({
                  skillName: skill.skillName || '',
                  skillDetails:
                    skill.skillDetails?.length > 0
                      ? skill.skillDetails.map((detail) => ({
                          SkillTopicHeader: detail.SkillTopicHeader || '',
                          SkillsSubHeadings: detail.SkillsSubHeadings?.length > 0 ? detail.SkillsSubHeadings : ['']
                        }))
                      : [
                          {
                            SkillTopicHeader: '',
                            SkillsSubHeadings: ['']
                          }
                        ]
                }))
              : [
                  {
                    skillName: '',
                    skillDetails: [
                      {
                        SkillTopicHeader: '',
                        SkillsSubHeadings: ['']
                      }
                    ]
                  }
                ]
        };

        setFormData(updatedFormData);

        // Image handling remains the same
        const setImageUrl = (image) => (image?.startsWith('http') ? image : `${server}/uploads/${image}`);
        setImageUrl1(data.image1 ? setImageUrl(data.image1) : null);
        setImageUrl2(data.image2 ? setImageUrl(data.image2) : null);
        setImageUrl3(data.image3 ? setImageUrl(data.image3) : null);
        setCardimageUrl(data.Cardimage ? setImageUrl(data.Cardimage) : null);

        setImageName1(data.image1 ? data.image1.split('/').pop() : '');
        setImageName2(data.image2 ? data.image2.split('/').pop() : '');
        setImageName3(data.image3 ? data.image3.split('/').pop() : '');
        setCardimageName(data.Cardimage ? data.Cardimage.split('/').pop() : '');
        setbrochureUrl(data?.brochure);
      } catch (error) {
        console.error('Error fetching training data:', error);
        toast.error('Failed to load training data.');
      }
    };

    fetchTrainingData();
  }, [id, server]);

  const handleImageChange = (event, imageId) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imageName = file.name;

      switch (imageId) {
        case 'image1':
          setImage1(file); // Store File object for upload
          setImageUrl1(imageUrl); // Store URL for preview
          setImageName1(imageName);
          break;
        case 'image2':
          setImage2(file);
          setImageUrl2(imageUrl);
          setImageName2(imageName);
          break;
        case 'image3':
          setImage3(file);
          setImageUrl3(imageUrl);
          setImageName3(imageName);
          break;

        case 'Cardimage':
          setCardimage(file);
          setCardimageUrl(imageUrl);
          setCardimageName(imageName);
          break;
        default:
          break;
      }
    }
  };

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection[index][name] = value;
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleCourseChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFeeStructure = [...prev.FeeStructure];
      updatedFeeStructure[index] = { ...updatedFeeStructure[index], [name]: value };
      return { ...prev, FeeStructure: updatedFeeStructure };
    });
  };

  const addField = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { question: '', answer: '' }]
    }));
  };

  const addCourseField = () => {
    setFormData((prev) => ({
      ...prev,
      FeeStructure: [...prev.FeeStructure, { course: '', lastPrice: '', currentPrice: '' }]
    }));
  };

  const removeField = (section, index) => {
    setFormData((prev) => {
      const updatedSection = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: updatedSection };
    });
  };
  const handleSkillsChange = (e, skillIndex, detailIndex, subHeadingIndex) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];

      if (typeof subHeadingIndex === 'number') {
        // Update subheading
        updatedSkills[skillIndex].skillDetails[detailIndex].SkillsSubHeadings[subHeadingIndex] = value;
      } else if (typeof detailIndex === 'number') {
        // Update skill detail header
        updatedSkills[skillIndex].skillDetails[detailIndex][name] = value;
      } else {
        // Update skill name
        updatedSkills[skillIndex][name] = value;
      }

      return { ...prev, Skills: updatedSkills };
    });
  };

  const removeSubHeading = (skillIndex, detailIndex, subHeadingIndex) => {
    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];
      updatedSkills[skillIndex].skillDetails[detailIndex].SkillsSubHeadings = updatedSkills[skillIndex].skillDetails[
        detailIndex
      ].SkillsSubHeadings.filter((_, i) => i !== subHeadingIndex);
      return { ...prev, Skills: updatedSkills };
    });
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      Skills: [
        ...prev.Skills,
        {
          skillName: '',
          skillDetails: [
            {
              SkillTopicHeader: '',
              SkillsSubHeadings: ['']
            }
          ]
        }
      ]
    }));
  };

  const addSkillDetail = (skillIndex) => {
    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];
      updatedSkills[skillIndex].skillDetails.push({
        SkillTopicHeader: '',
        SkillsSubHeadings: ['']
      });
      return { ...prev, Skills: updatedSkills };
    });
  };

  const addSubHeading = (skillIndex, detailIndex) => {
    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];
      updatedSkills[skillIndex].skillDetails[detailIndex].SkillsSubHeadings.push('');
      return { ...prev, Skills: updatedSkills };
    });
  };

  const removeSkill = (skillIndex) => {
    setFormData((prev) => ({
      ...prev,
      Skills: prev.Skills.filter((_, i) => i !== skillIndex)
    }));
  };

  const removeSkillDetail = (skillIndex, detailIndex) => {
    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];
      updatedSkills[skillIndex].skillDetails = updatedSkills[skillIndex].skillDetails.filter((_, i) => i !== detailIndex);
      return { ...prev, Skills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Trainingtitle ||
      !formData.trainingName ||
      !formData.contentParagraph1 ||
      !formData.contentParagraph2 ||
      !formData.contentParagraph3
    ) {
      toast.error('Please fill out all the required fields.');
      return;
    }

    const data = new FormData();
    data.append('Trainingtitle', formData.Trainingtitle);
    data.append('trainingName', formData.trainingName);
    data.append('contentPara1', formData.contentParagraph1);
    data.append('contentPara2', formData.contentParagraph2);
    data.append('contentPara3', formData.contentParagraph3);
    data.append('TrainingOverview', JSON.stringify(formData.TrainingOverview));
    data.append('pageHeader', formData.pageHeader);
    data.append('QnAContent', JSON.stringify(formData.QnAContent));
    data.append('FeeStructure', JSON.stringify(formData.FeeStructure));
    const formattedSkills = formData.Skills.map((skill) => ({
      skillName: skill.skillName,
      skillDetails: skill.skillDetails
        .map((detail) => ({
          SkillTopicHeader: detail.SkillTopicHeader,
          SkillsSubHeadings: detail.SkillsSubHeadings.filter((sub) => sub.trim() !== '') // Remove empty subheadings
        }))
        .filter((detail) => detail.SkillTopicHeader.trim() !== '') // Remove empty details
    })).filter((skill) => skill.skillName.trim() !== ''); // Remove empty skills

    console.log('Formatted Skills:', JSON.stringify(formattedSkills, null, 2)); // Debug log

    if (formattedSkills.length === 0) {
      toast.error('Please add at least one valid skill with details.');
      return;
    }

    data.append('skills', JSON.stringify(formattedSkills));

    if (formData.brochure) {
      data.append('brochure', formData.brochure);
    }

    // Append images only if they are File objects (new uploads)
    if (image1 instanceof File) data.append('image1', image1);
    if (image2 instanceof File) data.append('image2', image2);
    if (image3 instanceof File) data.append('image3', image3);
    if (Cardimage) {
      data.append('Cardimage', Cardimage);
    }

    try {
      const response = await axios.put(`${server}/api/trainings/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Training updated successfully:', response.data);
      toast('Training updated successfully!');
      // navigate('/apps/allcourses');
    } catch (error) {
      console.error('Error updating training:', error);
      toast.error('Failed to update training.');
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Edit Training</h2>

      <div className="space-y-6">
        <div>
          <Typography sx={{ marginBottom: 1 }}>Title</Typography>
          <TextField
            variant="outlined"
            fullWidth
            name="Trainingtitle"
            value={formData.Trainingtitle}
            onChange={(e) => setFormData({ ...formData, Trainingtitle: e.target.value })}
          />
        </div>

        <div>
          <Typography sx={{ marginBottom: 1 }}>Training Name</Typography>
          <TextField
            variant="outlined"
            fullWidth
            name="trainingName"
            value={formData.trainingName}
            onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
          />
        </div>

        <div>
          <Typography sx={{ marginBottom: 1 }}>Content Paragraph 1</Typography>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentParagraph1"
            value={formData.contentParagraph1}
            onChange={(e) => setFormData({ ...formData, contentParagraph1: e.target.value })}
          />
        </div>

        <div>
          <Typography sx={{ marginBottom: 1 }}>Content Paragraph 2</Typography>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentParagraph2"
            value={formData.contentParagraph2}
            onChange={(e) => setFormData({ ...formData, contentParagraph2: e.target.value })}
          />
        </div>

        <div>
          <Typography sx={{ marginBottom: 1 }}>Content Paragraph 3</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            name="contentParagraph3"
            value={formData.contentParagraph3}
            onChange={(e) => setFormData({ ...formData, contentParagraph3: e.target.value })}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image 1</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {imageUrl1 ? (
              <img src={imageUrl1} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>
          <div className="flex-1">
            <TextField label="Image Name" variant="outlined" value={imageName1} className="mb-4 w-full" disabled />
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image1')} className="hidden" id="file-input1" />
            <label
              htmlFor="file-input1"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image 2</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {imageUrl2 ? (
              <img src={imageUrl2} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>
          <div className="flex-1">
            <TextField label="Image Name" variant="outlined" value={imageName2} className="mb-4 w-full" disabled />
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image2')} className="hidden" id="file-input2" />
            <label
              htmlFor="file-input2"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image 3</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {imageUrl3 ? (
              <img src={imageUrl3} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>
          <div className="flex-1">
            <TextField label="Image Name" variant="outlined" value={imageName3} className="mb-4 w-full" disabled />
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image3')} className="hidden" id="file-input3" />
            <label
              htmlFor="file-input3"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Cardimage</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {CardimageUrl ? (
              <img src={CardimageUrl} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>
          <div className="flex-1">
            <TextField label="Image Name" variant="outlined" value={CardimageName} className="mb-4 w-full" disabled />
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'Cardimage')} className="hidden" id="file-input4" />
            <label
              htmlFor="file-input4"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
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

        {/* Training Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Training Overview</h3>
          {formData.TrainingOverview.map((overview, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <Grid container spacing={3}>
                  {/* Lecture Field */}
                  <Grid item xs={3}>
                    <TextField
                      label={`Lecture`}
                      variant="outlined"
                      fullWidth
                      name="lecture"
                      value={overview.lecture}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  {/* Duration Field */}
                  <Grid item xs={3}>
                    <TextField
                      label={`Duration`}
                      variant="outlined"
                      fullWidth
                      name="duration"
                      value={overview.duration}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>
                  {/* Language Field */}
                  <Grid item xs={3}>
                    <TextField
                      label={`Language`}
                      variant="outlined"
                      fullWidth
                      name="language"
                      value={overview.language}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  {/* Students Field */}
                  <Grid item xs={3}>
                    <TextField
                      label={`Students`}
                      variant="outlined"
                      fullWidth
                      name="students"
                      value={overview.students}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  {/* Skill Level Field */}
                  <Grid item xs={3}>
                    <TextField
                      label={`Skill Level`}
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
                    <TextField
                      label={`Live Project`}
                      variant="outlined"
                      fullWidth
                      name="live_project"
                      value={overview.live_project}
                      onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                      className="mb-2 w-full"
                    />
                  </Grid>

                  {/* Assessments Dropdown */}
                  <Grid item xs={3}>
                    {/* Assessments Dropdown */}
                    <FormControl variant="outlined" className="mb-2 w-full">
                      <InputLabel>Assessments</InputLabel>
                      <Select
                        value={overview.assessments}
                        onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                        label="Assessments"
                        name="assessments"
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Mode Dropdown */}
                  {/* Mode Dropdown */}
                  <Grid item xs={3}>
                    <FormControl variant="outlined" className="mb-2 w-full">
                      <InputLabel>Mode</InputLabel>
                      <Select value={overview.mode} onChange={(e) => handleChange(e, 'TrainingOverview', index)} label="Mode" name="mode">
                        <MenuItem value="Offline">Offline</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          {formData?.Skills?.map((skill, skillIndex) => (
            <div key={skillIndex} className="border p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <TextField
                  label={`Skill Name ${skillIndex + 1}`}
                  variant="outlined"
                  fullWidth
                  name="skillName"
                  value={skill.skillName}
                  onChange={(e) => handleSkillsChange(e, skillIndex)}
                  className="mr-2"
                />
                <IconButton onClick={() => removeSkill(skillIndex)} color="error">
                  <RemoveCircle />
                </IconButton>
              </div>

              {skill.skillDetails.map((detail, detailIndex) => (
                <div key={detailIndex} className="ml-4 border-l-2 pl-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <TextField
                      label={`Topic Header ${detailIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      name="SkillTopicHeader"
                      value={detail.SkillTopicHeader}
                      onChange={(e) => handleSkillsChange(e, skillIndex, detailIndex)}
                      className="mr-2"
                    />
                    <IconButton onClick={() => removeSkillDetail(skillIndex, detailIndex)} color="error">
                      <RemoveCircle />
                    </IconButton>
                  </div>

                  <div className="ml-4">
                    <Typography variant="subtitle2" className="mb-2">
                      Subheadings:
                    </Typography>
                    {detail.SkillsSubHeadings.map((subHeading, subHeadingIndex) => (
                      <div key={subHeadingIndex} className="flex items-center mb-2">
                        <TextField
                          variant="outlined"
                          fullWidth
                          value={subHeading}
                          onChange={(e) => handleSkillsChange(e, skillIndex, detailIndex, subHeadingIndex)}
                          placeholder={`Subheading ${subHeadingIndex + 1}`}
                          className="mr-2"
                        />
                        <IconButton onClick={() => removeSubHeading(skillIndex, detailIndex, subHeadingIndex)} color="error">
                          <RemoveCircle />
                        </IconButton>
                      </div>
                    ))}
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddCircle />}
                      onClick={() => addSubHeading(skillIndex, detailIndex)}
                      className="mt-2"
                    >
                      Add Subheading
                    </Button>
                  </div>

                  {skill.skillDetails.length - 1 === detailIndex && (
                    <Button
                      variant="outlined"
                      // color="primary"

                      startIcon={<AddCircle />}
                      onClick={() => addSkillDetail(skillIndex)}
                      className="mt-4 bg-blue-600 text-white"
                    >
                      Add Skill Detail
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}

          <Button className="mt-4 bg-blue-600 text-white" startIcon={<AddCircle />} onClick={addSkill}>
            Add New Skill
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">QnA Content</h3>
          {formData.QnAContent.map((QnAContent, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div>
                <Typography sx={{ marginBottom: 1 }}>QnA Content {index + 1}</Typography>
                <div className="flex gap-3">
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="question"
                    value={QnAContent.question}
                    onChange={(e) => handleChange(e, 'QnAContent', index)}
                  />
                  <IconButton onClick={() => removeField('QnAContent', index)} color="error">
                    <RemoveCircle />
                  </IconButton>
                </div>
              </div>
              <TextField
                label={`QnA ${index + 1} Description`}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="answer"
                value={QnAContent.answer}
                onChange={(e) => handleChange(e, 'QnAContent', index)}
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('QnAContent')}>
            Add QnA
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Fee Structure</h3>
          {formData.FeeStructure.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <TextField
                variant="outlined"
                fullWidth
                name="course"
                value={item.course}
                onChange={(e) => handleCourseChange(e, index)}
                placeholder="Enter course name"
              />
              <TextField
                label="Last Price"
                variant="outlined"
                fullWidth
                name="lastPrice"
                value={item.lastPrice}
                onChange={(e) => handleCourseChange(e, index)}
                type="number"
                placeholder="Enter last price"
              />
              <TextField
                label="Current Price"
                variant="outlined"
                fullWidth
                name="currentPrice"
                value={item.currentPrice}
                onChange={(e) => handleCourseChange(e, index)}
                type="number"
                placeholder="Enter current price"
              />
              <Button
                className="bg-red-600 text-white hover:bg-red-700 hover:text-white w-[20vw]"
                onClick={() => removeField('FeeStructure', index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button className="bg-blue-500 mt-4 w-40 text-white" startIcon={<AddCircle />} onClick={addCourseField}>
            Add Course
          </Button>
        </div>

        <Button onClick={handleSubmit} fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          Update Training
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

export default EditTraining;
