const validateUsername = (first_name,Last_name) => {
    const regex1 = /^[a-zA-Z]{3,}$/; // Alphanumeric, at least 3 characters
    const regex2=/^[a-zA-Z]{4,}$/;
    const isCorrect=(first_name,Last_name)=>{
       return regex1.test(first_name) && regex2.test(Last_name);
      }
    
    if(isCorrect(first_name,Last_name)){
      return true;
    }
    return false;
    
  };
  
  // Validate password
  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/; // At least 6 characters, one number, one special character
    return regex.test(password);
  };

  //validate email
  
  const validateEmail=async(email)=>{
    const regrex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regrex.test(email);
  
  }

  module.exports={
    validateEmail,
    validatePassword,
    validateUsername,
  }