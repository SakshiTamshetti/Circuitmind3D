import google.generativeai as genai; genai.configure(api_key='AIzaSyAbzHCiCL_orLxtu7gxqoEevgyAUaP0rPY'); print([m.name for m in genai.list_models() if 'flash' in m.name])
