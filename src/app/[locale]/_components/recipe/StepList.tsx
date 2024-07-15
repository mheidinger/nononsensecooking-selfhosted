import styles from "./StepList.module.css";

interface Props {
  steps: string[];
}

const StepList = ({ steps }: Props) => (
  <ol className={styles.list}>
    {steps?.map((step, i) => (
      <li className={styles.step} key={i}>
        <span className={styles.stepCounter}>{i + 1}</span>
        <span className={styles.stepDescription}>{step}</span>
      </li>
    ))}
  </ol>
);

export default StepList;
