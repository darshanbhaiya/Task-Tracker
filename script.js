document.addEventListener('DOMContentLoaded',()=>{

    const taskForm=document.getElementById('taskForm');
    const taskSection=document.getElementById('task-section')
    const daysFilter=document.getElementById('days')

    loadTasks();

    taskForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        addTask();
    });

    daysFilter.addEventListener('change',()=>{
        loadTasks();
    })

    function addTask(){
        const taskInput=document.getElementById('addTask').value;
        const dateInput=document.getElementById('date').value;

        if(taskInput && dateInput){
            const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
            const task={
                details: taskInput,
                date: dateInput,
                id:new Date().getTime()
            };
            tasks.push(task);
            localStorage.setItem('tasks',JSON.stringify(tasks))
            loadTasks();
            taskForm.reset()
        }
    }


    function loadTasks(){
        taskSection.innerHTML='';
        const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
        const filterValue = daysFilter.value;

        const filteredTasks=tasks.filter(task=>{
            const taskDate=new Date(task.date);
            const now=new Date();
            switch(filterValue){
                case '10':
                    return now-taskDate <= 10*24*60*60*1000;
                case '15':
                    return now-taskDate <= 15*24*60*60*1000;
                case '30':
                    return now-taskDate <= 30*24*60*60*1000;
                case 'today':
                    return taskDate.toDateString()===now.toDateString();
                case 'all':
                default:
                    return true;
            }
        })

        filteredTasks.forEach(task=>{
            const taskCard=document.createElement('div')
            taskCard.className='cards';
            taskCard.innerHTML=`
                <div class="task-heading">
                    <h3 >${task.details}</h3>
                    <p>${task.date}</p>
                </div>

                <div class="task-buttons">
                    <button type="button" onclick="updateTask(${task.id})" class="update">Update</button>
                    <button type="button" onclick="deleteTask(${task.id})" class="delete">Delete</button>
                </div>
            `
            taskSection.appendChild(taskCard);
        })

    }

    window.updateTask=function(id){
        const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
        const taskToUpdate=tasks.find(task=>task.id===id);
        if(taskToUpdate){
            document.getElementById('addTask').value=taskToUpdate.details;
            document.getElementById('date').value=taskToUpdate.date;
            deleteTask(id);
        }
    }

    window.deleteTask=function(id){
        const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks=tasks.filter(task=>task.id!==id);
        localStorage.setItem('tasks',JSON.stringify(updatedTasks));
        loadTasks()
    }

});