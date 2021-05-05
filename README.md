### Setup application (windows)

prerequisites:
* Node +v14.16.1
* python +3.9.0
* npm +6.14.12

1. Init python environment with **Command Prompt**:

```text
python -m venv python_packages && python_packages\Scripts\activate && pip install -r requirements.txt
```

2. Select local environment with **Powershell**: 

```text
. python_packages\Scripts\activate
```

4. Install dependecies for Node (backend) with **Powershell**/**Command Prompt**:

```text
npm i
```

5. Install dependecies for React (frontend) **Command Prompt**:

```text
cd client && npm i
```

6. Start backend with **Powershell**/**Command Prompt**:

```text
npm run start
```

7. Start frontend with **Command Prompt**:

```text
cd client && npm run start
```