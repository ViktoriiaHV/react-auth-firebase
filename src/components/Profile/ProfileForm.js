import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  const changePasswordHandler = (event) => {
    event.preventDefault();
    if (!newPassword || newPassword.trim() === "") {
      return;
    }
    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAOeeCRJY_UUxJyEQi0BSLdNcPK18q1-jg",
      {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newPassword,
          returnSecureToken: true,
        }),
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          res.json().then((data) => console.log(data));
          setError(null)
          setSuccessMessage('The password has been changed')
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then()
      .catch((e) => setError(e.message));
  };

  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
      {<p className='error'>{error}</p>}
      {<p className='success'>{successMessage}</p>}
    </form>
  );
};

export default ProfileForm;
