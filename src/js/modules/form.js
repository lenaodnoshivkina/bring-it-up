export default class Form {
    constructor(form) {
        this.forms = document.querySelectorAll(form);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Загрузка...' ,
            success: 'Спасибо! Скоро с Вами свяжутся',
            failure: 'Что-то пошло не так...',
         };
    
        this.path = 'assets/question.php';

    }

    async postData (url, data) {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });
    
        return await res.text();
    }

    clearInputs(){
        this.inputs.forEach(item => {
            item.value = '';
        });
    }

    checkMailInputs(selector){
        const mailInputs = document.querySelectorAll('[type="email"]');
    
        mailInputs.forEach(input => {
            input.addEventListener('keypress', function(e){
                if (e.key.match(/[^a-z 0-9 @ \.]/ig)){
                    e.preventDefault();
                }
            });
        });
    }

    initMask(){

        let setCursorPosition = (pos, elem) => {
            elem.focus();
    
            if(elem.setSelectionRange){
                elem.setSelectionRange(pos, pos);
            }else if(elem.createTextRange){
                let range = elem.createTextRange();
    
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
        
        function createMask(event){
            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');
    
    
            if(def.length >= val.length){
                val = def;
            }
    
            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur'){
                if (this.value.length == 2){
                    this.value = '';
                }
            }else{
                setCursorPosition(this.value.length, this);
            }
        }
    
        let inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('inputs', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    init(){
        this.checkMailInputs();
        this.initMask();

        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
    
                form.classList.add('animated', 'fadeOutUp');
                setTimeout(() => {
                    form.style.display = 'none';
                }, 400);

                let textMessage = document.createElement('div');
                textMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 20px;
                    color: black;
                `;
                form.parentNode.appendChild(textMessage);
                textMessage.textContent = this.message.loading;

    
                const formData = new FormData(form);
    
                this.postData(this.path, formData).then(res => {
                    console.log(res);
                        textMessage.textContent = this.message.success;
                    
                }).catch(() => {
                    textMessage.textContent = this.message.failure;               
                }).finally(() => {
                    this.clearInputs();
                    setTimeout(() => {
                        textMessage.remove();
                        form.style.display = 'block';
                        form.classList.remove('fadeOutUp');
                        form.classList.add('fadeInUp');
                    }, 5000);
                });
    
            });
        });
    }
}