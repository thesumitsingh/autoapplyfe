import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Sumitvideo from './Sumitvideo';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    resume: null,
    linkedinUrl: ''
  });
  const [jobsData, setJobsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(25);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1024 * 1024 && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, resume: e.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PDF file with size less than 1MB.');
    }
  };

  /* eslint-disable no-unused-vars */
  const handleSubmit = (joburl) => (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    
    // Validate form fields
    const { firstName, lastName, email, phoneNumber, resume, linkedinUrl } = formData;
    if (!firstName || !lastName || !email || !phoneNumber || !resume || !linkedinUrl) {
      alert('All fields are mandatory.');
      return;
    }
  
    // Construct the request body
    const requestBody = {
      url: joburl, // Pass the URL as the first field
      firstname: firstName,
      lastname: lastName,
      email: email,
      gender:'male',
      linkedin: linkedinUrl,
      phone: phoneNumber,
      profile: '1', // Add your logic for profile field here
      pdf_data: resume // Assuming the resume is already base64 encoded
    };
  
    // Send form data to API
    axios.post('http://143.47.124.243/apply', requestBody)
      .then(response => {
        setIsSubmitting(false);
        console.log('Application submitted successfully:', response.data);
        // Clear form fields after submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          resume: null,
          linkedinUrl: ''
        });
        alert('Application submitted successfully!');
      })
      .catch(error => {
        setIsSubmitting(false);
        console.error('Error submitting application:', error);
        alert('Failed to submit application. Please try again later.');
      });
  };
  

  useEffect(() => {
    let timer;
    if (isSubmitting) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitting]);


  /* eslint-enable no-unused-vars */
  const handleSearch = () => {
    // Send search term to API
    axios.post('http://143.47.124.243/search', { search_term: searchTerm })
      .then(response => {
        console.log('Search results:', response.data);
        setJobsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        alert('Failed to fetch search results. Please try again later.');
      });
  };

  const handleSearchMoreResults = () => {
    // Send search term to API
    axios.post('http://143.47.124.243/search', { search_term: searchTerm })
      .then(response => {
        console.log('Additional search results:', response.data);
        setJobsData(prevJobsData => [...prevJobsData, ...response.data]);
      })
      .catch(error => {
        console.error('Error fetching additional search results:', error);
        alert('Failed to fetch additional search results. Please try again later.');
      });
  };
  
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <>
      <Navbar/>
      
      <div className="container">
        <Sumitvideo className="center-container centered-content"/>
        <h5>Step 1: Fill basic details</h5>
        <table className="invisible-table">
          <tbody>
            <tr>
              <td><label className="form-label">First Name</label></td>
              <td><input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td><label className="form-label">Last Name</label></td>
              <td><input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td><label className="form-label">Email</label></td>
              <td><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td><label className="form-label">Phone Number</label></td>
              <td><input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td><label className="form-label">Resume</label></td>
              <td><input type="file" className="form-control" accept="application/pdf" onChange={handleFileChange} required /></td>
            </tr>
            <tr>
              <td><label className="form-label">LinkedIn URL</label></td>
              <td><input type="url" className="form-control" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} required /></td>
            </tr>
          </tbody>
        </table>
        {/* <button type="submit" className="btn btn-success">Submit Application</button> */}

        <hr />

        <div>
          <h5>Step 2: Search for job and apply</h5>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Tip: write only keyword (for example, for searching software engineer jobs, write only 'software'" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-success mb-3" onClick={handleSearch}>Search</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Role Title</th>
                <th>Company Name</th>
                <th>Location</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {jobsData.map(job => (
                <tr key={job.jobid}>
                  <td>{job.roletitle}</td>
                  <td>{job.companyname}</td>
                  <td>{job.location}</td>
                  <td><a href={`https://boards.greenhouse.io/embed/job_app?for=${job.boardtoken}&token=${job.jobid}`} target="_blank" rel="noopener noreferrer">Link</a></td>
                  {/* https://boards.greenhouse.io/embed/job_app?for=asana&token=5626829*/}
                  <td><button className="btn btn-success" disabled={isSubmitting} onClick={handleSubmit(`https://boards.greenhouse.io/embed/job_app?for=${job.boardtoken}&token=${job.jobid}`)}>{isSubmitting ? `Wait (${countdown})` : 'Apply'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handleSearchMoreResults}>More results..</button>
        </div>
      </div>
    </>
  );
}

export default App;
