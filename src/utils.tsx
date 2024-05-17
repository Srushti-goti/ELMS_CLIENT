export const BASE_URL = "http://ec2-100-24-29-182.compute-1.amazonaws.com"
// export const BASE_URL = "http://localhost:5286"

// /http://ec2-100-24-29-182.compute-1.amazonaws.com/

export const authHeader = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
}

export const _userName = JSON.parse(String(localStorage.getItem("user")))?.name || null;