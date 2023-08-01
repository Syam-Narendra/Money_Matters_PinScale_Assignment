import Cookies from "js-cookie";

const deleteTranscation= async TransId=>{
    const deleteApiUrl= `https://bursting-gelding-24.hasura.app/api/rest/delete-transaction?id=${TransId}`
    const userId = Cookies.get("user_id")
    const headers = {
        'content-type': 'application/json',
        "x-hasura-role":"user",
        "x-hasura-user-id":userId,
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF'
      };
      
      const requestOptions = {
        method: 'DELETE',
        headers: headers,
      };

      await fetch(deleteApiUrl, requestOptions)
}

export default deleteTranscation