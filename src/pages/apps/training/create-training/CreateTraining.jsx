import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, IconButton, CircularProgress } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Typography from '@mui/material/Typography';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    Trainingtitle: '',
    trainingName: '',
    contentParagraph1: '',
    contentParagraph2: '',
    contentParagraph3: '',
    QnAContent: [{ question: '', answer: '' }],
    brochure: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    pageHeader: '',
    courseOverview: '',
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
    // QnAContents: []
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  const [imageUrl1, setImageUrl1] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const [imageUrl3, setImageUrl3] = useState(null);

  const [imageName1, setImageName1] = useState('');
  const [imageName2, setImageName2] = useState('');
  const [imageName3, setImageName3] = useState('');
  const [Cardimage, setCardimage] = useState(null);
  const [CardimageUrl, setCardimageUrl] = useState(null);
  const [CardimageName, setCardimageName] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  const handleImageChange = (event, imageId) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imageName = file.name;
      console.log('image change--->', imageId);

      switch (imageId) {
        case 'image1':
          setImage1(file);
          setImageUrl1(imageUrl);
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

  // Handle input changes for dynamic fields
  const handleChange = (e, section, index, paragraphIndex = null) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedSection = [...prev[section]];

      if (paragraphIndex !== null) {
        updatedSection[index].paragraph[paragraphIndex] = value;
      } else {
        updatedSection[index][name] = value;
      }

      return { ...prev, [section]: updatedSection };
    });
  };

  const handleCourseChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFeeStructure = [...prev.FeeStructure];
      updatedFeeStructure[index] = { ...updatedFeeStructure[index], [name.split('-')[0]]: value };
      return { ...prev, FeeStructure: updatedFeeStructure };
    });
  };

  const addField = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? [...prev[section], { question: '', answer: [''] }] : [{ question: '', answer: [''] }]
    }));
  };

  // Add a new course pricing entry
  const addCourseField = () => {
    setFormData((prev) => ({
      ...prev,
      FeeStructure: [
        ...(prev.FeeStructure || []), // Ensure it's always an array
        { course: '', lastPrice: '', currentPrice: '' } // New empty course fields
      ]
    }));
  };

  const removeField = (section, index) => {
    setFormData((prev) => {
      const updatedSection = prev[section]?.filter((_, i) => i !== index);
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleSkillsChange = (e, skillIndex, detailIndex, subHeadingIndex = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];
      if (subHeadingIndex !== null) {
        updatedSkills[skillIndex].skillDetails[detailIndex].SkillsSubHeadings[subHeadingIndex] = value;
      } else if (name === 'skillName') {
        updatedSkills[skillIndex].skillName = value;
      } else {
        updatedSkills[skillIndex].skillDetails[detailIndex][name] = value;
      }
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

  const removeSubHeading = (skillIndex, detailIndex, subHeadingIndex) => {
    setFormData((prev) => {
      const updatedSkills = [...prev.Skills];
      updatedSkills[skillIndex].skillDetails[detailIndex].SkillsSubHeadings = updatedSkills[skillIndex].skillDetails[
        detailIndex
      ].SkillsSubHeadings.filter((_, i) => i !== subHeadingIndex);
      return { ...prev, Skills: updatedSkills };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create FormData for API submission
    const data = new FormData();
    if (
      !formData.Trainingtitle ||
      !formData.trainingName ||
      !formData.contentParagraph1 ||
      !formData.contentParagraph2 ||
      !formData.contentParagraph3
    ) {
      toast.error('Please , Enter All the Required Fields');
      return;
    }


    data.append('Trainingtitle', formData.Trainingtitle);

    data.append('trainingName', formData.trainingName);
    data.append('contentPara1', formData.contentParagraph1);
    data.append('contentPara2', formData.contentParagraph2);
    data.append('contentPara3', formData.contentParagraph3);
    // Add Skills data
    // Format and append Skills in the exact structure
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
      toast.error('Please Add At least 1 valid Skill with Details.');
      return;
    }

    data.append('skills', JSON.stringify(formattedSkills));
    // data.append('courseOverview', formData.courseOverview);

    // Ensure TrainingOverview is not null by defaulting to an empty array if needed
    const trainingOverview = formData.TrainingOverview || [];
    data.append('TrainingOverview', JSON.stringify(trainingOverview)); // Stringify the array

    data.append('pageHeader', 'industrial-development');

    // Ensure QnAContents (keyModules) is a JSON string if it's an array; default to an empty array if not provided
    const QnAContentsString = JSON.stringify(formData.QnAContent || []);
    data.append('QnAContent', QnAContentsString);

    const FeestructureString = JSON.stringify(formData.FeeStructure || []);
    console.log('formdata--->', formData);

    if (formData?.FeeStructure != []) {
      data.append('FeeStructure', FeestructureString);
    } else {
      toast.error('Feestructure is required');
      return;
      // data.append('FeeStructure', FeestructureString);
    }

    // if (formData.image1) {
    //   data.append('image1', formData.image1); // Attach the image file
    // }

    // if (formData.image2) {
    //   data.append('image2', formData.image2); // Attach the image file
    // }

    // if (formData.image3) {
    //   data.append('image3', formData.image3); // Attach the image file
    // }

    // // Attach the image if present

    if (formData.brochure) {
      data.append('brochure', formData.brochure); // Attach the brochure file
    }

    if (Cardimage) {
      data.append('Cardimage', Cardimage);
    }

    if (!Cardimage) {
      toast.error('Please Upload Card Image.');
      return;
    }

    if (image1) {
      data.append('image1', image1);
    }

    if (image2) {
      data.append('image2', image2);
    }

    if (image3) {
      data.append('image3', image3);
    }
    if (!image1 && !image2 && !image3) {
      toast.error('Oops!, Please Upload At Least 1 Image.');
      return;
    }
setLoading(true);

    try {
      const response = await axios.post(`${server}/api/trainings/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Training Added successfully:', response.data);
      toast('Training Added Successfully!');
      // navigate('/apps/allcourses')
      setFormData({
        Trainingtitle: '',
        trainingName: '',
        contentParagraph1: '',
        contentParagraph2: '',
        contentParagraph3: '',
        QnAContent: [{ question: '', answer: '' }],
        // courseModules: [{ heading: '', paragraphs: [''] }],
        // keyModules: [{ heading: '', paragraphs: '' }],

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

        FeeStructure: [{ course: '', lastPrice: '', currentPrice: '' }]
      });

      setImage1(null);
      setImageName1('');
      setImageUrl1(null);

      setImage2(null);
      setImageName2('');
      setImageUrl2(null);

      setImage3(null);
      setImageName3('');
      setImageUrl3(null);
    } catch (error) {
      console.error('Error creating course:', error);
      // Handle error (e.g., show an error message)
    }
    finally {
    setLoading(false); // 🔥 Stop loading
  }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Create New Training</h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Typography sx={{ marginBottom: 1 }}>Title *</Typography>
          <TextField
            // label="Title"
            variant="outlined"
            fullWidth
            name="Trainingtitle"
            value={formData.Trainingtitle}
            onChange={(e) => setFormData({ ...formData, Trainingtitle: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Training Name */}
        <div>
          <Typography sx={{ marginBottom: 1 }}>Training Name *</Typography>
          <TextField
            // label="Training Name"
            variant="outlined"
            fullWidth
            name="trainingName"
            value={formData.trainingName}
            onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Content Paragraph 1 */}
        <div>
          <Typography sx={{ marginBottom: 1 }}>Content Paragraph 1 *</Typography>
          <TextField
            // label="Content Paragraph 1"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentParagraph1"
            value={formData.contentParagraph1}
            onChange={(e) => setFormData({ ...formData, contentParagraph1: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Content Paragraph 2 */}
        <div>
          <Typography sx={{ marginBottom: 1 }}>Content Paragraph 2 *</Typography>
          <TextField
            // label="Content Paragraph 2"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentParagraph2"
            value={formData.contentParagraph2}
            onChange={(e) => setFormData({ ...formData, contentParagraph2: e.target.value })}
            className="mb-6 w-full"
          />
        </div>

        {/* Content Paragraph 3 */}
        <div>
          <Typography sx={{ marginBottom: 1 }}>Content Paragraph 3 *</Typography>
          <TextField
            // label="Content Paragraph 3"
            multiline
            rows={4}
            fullWidth
            name="contentParagraph3"
            value={formData.contentParagraph3}
            onChange={(e) => setFormData({ ...formData, contentParagraph3: e.target.value })}
            className="mb-6 w-full"
          />
        </div>

        {/* Upload Image 1 */}

        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image 1</h2>
        <div className="flex items-center gap-6">
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {imageUrl1 ? (
              <img src={imageUrl1} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <TextField
              label="Image Name"
              variant="outlined"
              value={imageName1}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
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
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {imageUrl2 ? (
              <img src={imageUrl2} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <TextField
              label="Image Name"
              variant="outlined"
              value={imageName2}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
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
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {imageUrl3 ? (
              <img src={imageUrl3} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <TextField
              label="Image Name"
              variant="outlined"
              value={imageName3}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image3')} className="hidden" id="file-input3" />
            <label
              htmlFor="file-input3"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        {/* Card Image Upload Section */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Card Image *</h2>
        <div className="flex items-center gap-6">
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {CardimageUrl ? (
              <img src={CardimageUrl} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <TextField
              label="Image Name"
              variant="outlined"
              value={CardimageName}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'Cardimage')}
              className="hidden"
              id="file-input-card"
            />
            <label
              htmlFor="file-input-card"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        {/* Brochure Upload Section */}

        <div className="mb-4">
          <label htmlFor="brochure" className="block text-sm font-medium text-gray-700">
            Upload Brochure
          </label>
          <input
            type="file"
            id="brochure"
            onChange={(e) => setFormData({ ...formData, brochure: e.target.files[0] })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.brochure && <p className="mt-1 text-sm text-gray-500">{formData.brochure.name}</p>}
        </div>
        {/* Training Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Training Overview</h3>
          {formData.TrainingOverview.map((overview, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <TextField
                  label={`Lecture`}
                  variant="outlined"
                  fullWidth
                  name="lecture"
                  value={overview.lecture}
                  onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                  className="mb-2 w-full"
                />
                <TextField
                  label={`Duration`}
                  variant="outlined"
                  fullWidth
                  name="duration"
                  value={overview.duration}
                  onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                  className="mb-2 w-full"
                />
                <TextField
                  label={`Language`}
                  variant="outlined"
                  fullWidth
                  name="language"
                  value={overview.language}
                  onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                  className="mb-2 w-full"
                />
                <TextField
                  label={`Students`}
                  variant="outlined"
                  fullWidth
                  name="students"
                  value={overview.students}
                  onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                  className="mb-2 w-full"
                />
                <TextField
                  label={`Skill Level`}
                  variant="outlined"
                  fullWidth
                  name="skill_level"
                  value={overview.skill_level}
                  onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                  className="mb-2 w-full"
                />
                <TextField
                  label={`Live Project`}
                  variant="outlined"
                  fullWidth
                  name="live_project"
                  value={overview.live_project}
                  onChange={(e) => handleChange(e, 'TrainingOverview', index)}
                  className="mb-2 w-full"
                />

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

                {/* Mode Dropdown */}
                <FormControl variant="outlined" className="mb-2 w-full">
                  <InputLabel>Mode</InputLabel>
                  <Select value={overview.mode} onChange={(e) => handleChange(e, 'TrainingOverview', index)} label="Mode" name="mode">
                    <MenuItem value="Offline">Offline</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                  </Select>
                </FormControl>
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

        {/*Qna Content */}
        <div>
          <h3 className="text-lg font-semibold mb-2">QnA Content</h3>
          {formData?.QnAContent?.map((QnAContent, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div>
                {/* <Typography>QnA Content {index + 1}</Typography> */}
                <Typography sx={{ marginBottom: 1 }}>QnA Content {index + 1}</Typography>
                <div className="flex gap-3">
                  <TextField
                    //   label={`QnA Content ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    name="question"
                    value={QnAContent.question}
                    onChange={(e) => handleChange(e, 'QnAContent', index)}
                    className="mb-2 w-full"
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
                className="mb-6 w-full"
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('QnAContent')} className="mb-6">
            Add QnA
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Fee Structure</h3>
          {formData?.FeeStructure?.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              {/* Course Name */}
              <TextField
                variant="outlined"
                fullWidth
                name="course"
                value={item.course}
                onChange={(e) => handleCourseChange(e, index)}
                placeholder="Enter course name"
              />

              {/* Last Price */}
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

              {/* Current Price */}
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

              {/* Remove Course Button */}
              <Button className="bg-red-600 text-white hover:bg-red-700 hover:text-white w-[20vw]" onClick={() => removeField(index)}>
                Remove
              </Button>
            </div>
          ))}

          {/* Add Course Button BELOW the Fields */}
          <Button
            // variant="contained"
            // color="primary"
            className="bg-blue-500 mt-4 w-40 text-white"
            startIcon={<AddCircle />}
            onClick={addCourseField} // ✅ Adds a new course
            // className="mt-4 w-full"
          >
            Add Course
          </Button>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit}   disabled={loading}  fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
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
        theme="light" // Ensures the white background
      />
    </div>
  );
};

export default CreateCourse;
