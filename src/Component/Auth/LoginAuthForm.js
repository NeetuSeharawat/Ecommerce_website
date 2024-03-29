import { useState, useRef, useContext,Fragment } from 'react';
import { useNavigate } from "react-router";
import AuthContext from '../Store/AuthContext';
import classes from './AuthForm.module.css';

const LoginAuthForm = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  
  const authCtx = useContext(AuthContext); // login will get called in this context now

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading,setIsLoading]= useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) =>
  {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    //Adding Validation
   setIsLoading(true);
   let url;
   if(isLogin){
   url= 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCuwdlNK_HArrq59Wc3Qjsd5yNizUCUGHw'
 }
fetch(url,{
     method: "POST",
     body: JSON.stringify({
      email: enteredEmail,
      password: enteredPassword,
      returnSecureToken: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }
).then(async (res) => {
  
  setIsLoading(false);
  
  if (res.ok) {
    //console.log("user is succesfully signed up");
    return res.json();
  }else {
    await res.json();
    let errorMessage = "Authentication failed";
    /* if (data && data.error && data.error.message) {
      errorMessage = data.error.message;
    } */
    throw new Error(errorMessage);
  }
})
.then((data) => {
        const replacedEmailId =enteredEmail.replace("@", "").replace(".", "");
        authCtx.Login(data.idToken, replacedEmailId);
        
        navigate("/store", { replace: true });
      })
      .catch((err) => {
        alert(err.message);
      });
};
  return (
    <Fragment>
    <section className={classes.auth}>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
        {!isLoading && <button>{isLogin?'Login': 'Create Account'}</button>}
         {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
    </Fragment>
  );
};
export default LoginAuthForm;