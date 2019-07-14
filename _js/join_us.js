import Joi from '@hapi/joi'
import $ from 'jquery'
import '@babel/polyfill'

const schemas = {
  club: Joi.string()
    .min(3)
    .max(70)
    .required()
    .label('Club Name')
    .error(([error]) => {
      switch (error.type) {
        case 'string.min':
          return `The club name must be at least ${
            error.context.limit
          } letters long!`
        case 'string.max':
          return `The club name can't be longer than ${
            error.context.limit
          } letters!`
        case 'any.empty':
          return `The club name can't be empty!`
      }
      return 'foo'
    }),
  country: Joi.string()
    .length(2)
    .error(new Error('Please provide a valid country code!')), // Alpha 2 country code
  club_mail: Joi.string()
    .email()
    .error(new Error('Please provide a valid email address!')),
  club_presentation: Joi.string().error(
    new Error('Please enter a valid club presentation!')
  ),
  contact_person_name: Joi.string().error(
    new Error('Please enter a valid name!')
  ),
  contact_person_mail: Joi.string()
    .email()
    .error(new Error('Please provide a valid email address!')),
  contact_person_number: Joi.string()
    .regex(
      /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)[\d ]{4,20}$/
    )
    .error(new Error('Please enter a valid phone number!'))
}

const formSchema = Joi.object().keys(schemas)

function validateAndShowMessage (input) {
  const id = input.attr('id')
  const schema = schemas[id]
  if (schema === undefined) {
    return
  }
  const value = input.val()
  const result = schema.validate(value)
  if (result.error && input.parent().hasClass('input-box')) {
    input.parent().addClass('error')
    input.siblings('.error-message').html(result.error.message)
  } else {
    input.parent().removeClass('error')
    input.siblings('.error-message').html('')
  }
}

$(() => {
  const inputs = $('input:not([type=submit])')

  inputs.change(event => {
    const target = $(event.target)
    validateAndShowMessage(target)
  })

  const form = $('#join_form')
  const responseField = $('#response-message')

  form.submit(async event => {
    event.preventDefault()

    const values = {}
    let uncheckedBoxes = 0
    for (const input of inputs) {
      validateAndShowMessage($(input))
      switch (input.type) {
        case 'checkbox':
          if (!input.checked) uncheckedBoxes++
          break
        default:
          values[input.id] = input.value
      }
    }

    if (uncheckedBoxes > 0) {
      responseField.removeClass('success')
      responseField.addClass('error')
      responseField.html('All checkboxes must be checked.')
      return
    }

    const result = formSchema.validate(values)
    if (result.error) return

    const data = result.value

    try {
      const response = await $.post(
        'https://t5o4h93c1c.execute-api.eu-central-1.amazonaws.com/default/i2-sendgrid',
        {
          data: JSON.stringify(data)
        }
      )

      responseField.removeClass('error')
      responseField.addClass('success')
      responseField.html('Emails sent!')
    } catch (err) {
      responseField.removeClass('success')
      responseField.addClass('error')
      responseField.html('Server request failed.')
    }
  })
})
