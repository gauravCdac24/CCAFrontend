import API from '../../api/ApplicationAPI';
import {encrypt} from "../../components/global/util/EncryptDecrypt" ;


const AUTH_SERVICE = "/auth-service";
const GET_USER_LOGIN_BY_USERNAME = "/get-userlogin-by-username";

const authenticate = (userlogin)=>{
	return API.post(AUTH_SERVICE+"/authenticate", userlogin);
}

const validateOTP = (userName, otp) => {
  return API.post(AUTH_SERVICE+"/verify-otp", {userName, otp});
  
};

//

const createNewLogin = (userData) =>{
    return API.post(AUTH_SERVICE+"/add-new-user-login", userData);
};



const changeLoginStatus = (bid) =>{
  return API.get(AUTH_SERVICE+"/login-status-change-by-id", {
      params:{
          id: encrypt(bid)
      }
  })
}

const getNewToken = (refreshToken) =>{
  return API.post(AUTH_SERVICE+"/refreshtoken", refreshToken);
};

const forgotPassword = (email)=>{

return API.get(AUTH_SERVICE+"/forgot-password-otp", {
    params:{
      userEmail: encrypt(email)
    }
})

}

const validateForgotOTP = (emailid, otps) => {

  const qid = encrypt(emailid);
  const otp = encrypt(otps);

  return API.post(AUTH_SERVICE+"/validate-forgot-otp", {qid, otp});
  
};

const changePassword = (obj) =>{

  const userName = encrypt(obj.username);
  const newPassword = encrypt(obj.newpwd);
  const confirmPassword = encrypt(obj.confirmpwd);
  const currentPassword = encrypt(obj.currentpwd);

  return API.post(AUTH_SERVICE+"/change-password", {userName, newPassword, confirmPassword, currentPassword});
}

const resendLoginOTP = (username)=>{

  return API.get(AUTH_SERVICE+"/get-new-login-otp", {
      params:{
        qid: encrypt(username)
      }
  })
  
  }

  const resendForgotOTP = (emailid)=>{

    return API.get(AUTH_SERVICE+"/get-new-forgot-otp", {
        params:{
          qid: encrypt(emailid)
        }
    })
    
    }
  

  const validateEmailId = (obj)=>{

    return API.get(AUTH_SERVICE+"/validate-forgot-password-email", {
        params:{
          qid: encrypt(obj.emailid)
        }
    })
    
    }

    const getUserLoginByUsername = (username) => {

      return API.get(AUTH_SERVICE+GET_USER_LOGIN_BY_USERNAME, {
        params:{
          qid: encrypt(username)
        }
    })

    }
  




export default {getUserLoginByUsername, getNewToken, resendForgotOTP, createNewLogin, authenticate, validateOTP, changeLoginStatus, forgotPassword, validateForgotOTP, changePassword, resendLoginOTP, validateEmailId};