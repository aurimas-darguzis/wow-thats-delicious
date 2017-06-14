import axios from 'axios'
import { $ } from './bling'

function ajaxHeart (e) {
  e.preventDefault()
  // this => form tag
  axios.post(this.action)
       .then(res => {
          // this.heart => form has 'heart' attribute, in this case its a button
          const isHearted = this.heart.classList.toggle('heart__button--heated')
          $('.heart-count').textContent = res.data.hearts.length
          if (isHearted) {
            this.heart.classList.add('heart__button--float')
            setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500)
          }
       })
       .catch(console.error)
}

export default ajaxHeart;
