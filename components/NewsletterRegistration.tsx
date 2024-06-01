import { useState, FormEvent, useRef } from 'react'
import { useLabel as L, useElement as E, useLang } from 'lib/lang'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface FormData {
  email: string
  name: string
  building?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  apartment?: string
  frequency?: string
}

interface FormErrors {
  email?: string
}

const INTRO_FR = (
  <>
    <p>Restez informés à propos des activités et informations du Collectif.</p>
    <p>
      Vous aurez aussi la possibilité de voir les messages des autres
      locataires, et même y répondre si vous le voulez.{' '}
    </p>
    <p>C'est gratuit et vous pouvez vous désinscrire en tout temps.</p>
  </>
)

const INTRO_EN = (
  <>
    <p>Stay informed about the activities and information of the Collective.</p>
    <p>
      You will also have the opportunity to see messages from other tenants, and
      even respond to them if you wish.
    </p>
    <p>It's free and you can unregister at any time.</p>
  </>
)

function NewsletterRegistration() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    frequency: 'weekly',
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [registered, setRegistered] = useState<boolean>(false)
  const [busy, setBusy] = useState<boolean>(false)

  const emailRef = useRef<HTMLInputElement>()
  const buttonRef = useRef<HTMLButtonElement>()

  const INVALID_EMAIL = L('Courriel invalide', 'Invalid email')
  const EMAIL_REQUIRED = L('Courriel requis', 'Email is required')

  const validateEmail = (email: string, onSubmit?: boolean): string | null => {
    if (
      email &&
      (onSubmit || formErrors?.email !== undefined) &&
      !emailRef.current?.validity?.valid
    ) {
      return INVALID_EMAIL
    }

    if (!email) return EMAIL_REQUIRED

    return ''
  }

  const SUBMIT_SUCCESS_MSG = L(
    'Votre demande a été enregistrée avec succès.',
    'Your request has been saved successfully.',
  )
  const SUBMIT_ERROR_MSG = L(
    "Incapable d'enregistrer la demande, S.v.p ressayez plus tard.",
    'Unable to save your requestion, please try again later.',
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const emailError = validateEmail(formData.email, true)
    if (emailError) {
      setFormErrors({ ...formErrors, email: emailError })
      return // Stop the form submission if there is an error
    }

    try {
      setBusy(true)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setRegistered(true)
      toast.success(SUBMIT_SUCCESS_MSG)
    } catch (e) {
      console.error(e)
      toast.error(SUBMIT_ERROR_MSG)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let value = e.target.value
    if (e.target.name === 'building') {
      value = value.toUpperCase()
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-row w-full">
        {registered ? (
          <div className="text-2xl text-green-700  font-semibold flex items-center justify-center  h-36 w-full ">
            {L(
              'Merci pour votre inscription au Collectif!',
              'Thank you for registering with the Collective!',
            )}
          </div>
        ) : (
          <>
            <div className="w-1/3 hidden lg:flex">
              <div className="flex flex-col gap-4 justify-center h-full w-full py-2 px-2 pr-4 text-sm text-orange-900 italic ">
                {E(INTRO_FR, INTRO_EN)}
              </div>
            </div>
            <div className="w-2/3 grid grid-cols-3 gap-y-4 py-4 ">
              <div className="flex flex-col items-end font-bold px-2">
                <label htmlFor="email">{L('Courriel', 'Email')}:</label>
                <p className="text-[10px] text-orange-900 pl-4">
                  ({L('Obligatoire', 'Required')})
                </p>
              </div>
              <div className="flex flex-col col-span-2">
                <div className="w-full flex justify-start font-bold px-2">
                  <input
                    ref={emailRef}
                    name="email"
                    type="text"
                    required
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+[.][a-zA-Z]{2,}"
                    maxLength={100}
                    value={formData.email}
                    onChange={handleChange}
                    className="px-2 w-72 invalid:outline-red-500 invalid:ring-red-500 invalid:ring-2 rounded-sm focus:invalid:bg-red-200"
                  />
                </div>
                {formErrors?.email && (
                  <div className="text-red-500 px-2 font-semibold">
                    {formErrors?.email}
                  </div>
                )}
              </div>
              <div className="flex justify-end  px-2">
                <label htmlFor="name">{L('Nom', 'Name')}:</label>
              </div>
              <div className="flex justify-start  col-span-2 px-2">
                <input
                  name="name"
                  type="text"
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-72"
                />
              </div>
              <div className="flex justify-end  px-2">
                <label htmlFor="name">{L('Appartement', 'Apartment')}:</label>
              </div>
              <div className="flex justify-start  col-span-2 px-2">
                <input
                  name="building"
                  type="text"
                  maxLength={1}
                  pattern="[A-Fa-f]"
                  value={formData.building}
                  onChange={(event) => {
                    handleChange(event)
                  }}
                  className="w-8 pl-2 invalid:outline-red-500 invalid:ring-red-500 invalid:ring-2 rounded-sm focus:invalid:bg-red-200 "
                />
                <span className="px-2" />
                <input
                  name="apartment"
                  type="number"
                  maxLength={4}
                  value={formData.apartment}
                  onChange={handleChange}
                  className=" w-16 pl-2"
                />
              </div>
              <div className="flex justify-end font-semibold px-2">
                <legend>{L('Envoyez-moi', 'Notification Frequency')}:</legend>
              </div>
              <div className="flex justify-start  col-span-2 px-2">
                <fieldset>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="weekly"
                        checked={formData.frequency === 'weekly'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">
                        {L(
                          'Le récapitulatif hebdomadaire des messages',
                          'Digest of meesages once a week',
                        )}
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="daily"
                        checked={formData.frequency === 'daily'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />{' '}
                      <span className="text-sm text-gray-600">
                        {L(
                          'Le récapitulatif quotidien des messages',
                          'Digest of messages once a day',
                        )}
                      </span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="every"
                        checked={formData.frequency === 'every'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />{' '}
                      <span className="text-sm text-gray-600">
                        {L(
                          'Chaque message au fur et à mesure',
                          'Each message as they are received',
                        )}
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="every"
                        checked={formData.frequency === 'announcements'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />{' '}
                      <span className="text-sm text-gray-600">
                        {L(
                          'Les annonces importantes seulement',
                          'Important announcements only',
                        )}
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="every"
                        checked={formData.frequency === 'announcements'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">
                        {L('Aucun courriel', 'No emails')}
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col items-center col-span-3 ">
                <button
                  ref={buttonRef}
                  disabled={busy ? true : undefined}
                  className="text-white text-xl  bg-gray-900/75 block hover:bg-gray-900  py-2 px-4 rounded-lg"
                  type="submit"
                >
                  {L(
                    "Envoyer la demande d'inscription",
                    'Send the Registration Request',
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        <ToastContainer position="bottom-center" />
      </div>
    </form>
  )
}

export default NewsletterRegistration
