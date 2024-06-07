import { GoogleLogout } from 'react-google-login';
const clientId = "141320166900-r2jumu1ltudbqij12m2q81cq5liipvs5.apps.googleusercontent.com";
function LogoutGG() {
   const onSuccess = () => {
      console.log("Log out successfull!");
   }
   return (
      <div id="signOutButton">
         <GoogleLogout
            clientId={clientId}
            buttonText={"Logout"}
            onLogoutSuccess={onSuccess}
         />
      </div>
   )
}
export default LogoutGG