import PatientRow from '@/components/UI/patientRow';

export default function specialProgramSuggestion() {
    return (
        <div>
        <PatientRow
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        date={date} 
        time={timeOfDay}
        name="שם מטופל"
        isCenter
      />
        </div>

    )   
}
