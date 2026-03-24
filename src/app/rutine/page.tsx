import WeekComponent from "../components/organisms/week/week";
import FloatingActionButtons from "../components/atoms/fabicon/fabicon";
import './rutine.scss';

export default function RutinaPage() {
  return (
    <div className="container">
      <div><WeekComponent /></div>{/*Iniciales de los dias de la semana*/}
      <div><FloatingActionButtons /></div>
    </div>
  )
}
