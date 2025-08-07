import wretch from "wretch";
import FormDataAddon from "wretch/addons/formData";
import QueryStringAddon from "wretch/addons/queryString";
import AbortAddon from "wretch/addons/abort";

export const apiRouter = wretch()
  .addon(QueryStringAddon)
  .addon(AbortAddon())
  .url("/api/v1")
  .options({ credentials: "include" })
  .catcher(401, () => {
    alert("Your session has expired, please login again");
    window.location.href = "/app/login";
  });

export const authRouter = wretch().addon(QueryStringAddon).url("/api/v1/users");

export const w = wretch().addon(QueryStringAddon).addon(FormDataAddon);
