import SpellColorSettings from "./SpellColorSetings";

interface ModalProps {
  isModalOpen: boolean;
  onModalToggle: () => void;
  setHeroSpellColor: any;
  heroIndex: number;
  currentColor: string;
}

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onModalToggle,
  setHeroSpellColor,
  heroIndex,
  currentColor
}) => {
  return (
    <div style={styles.container}>
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span style={styles.close} onClick={onModalToggle}>
              &times;
            </span>
            <SpellColorSettings
              onColorChange={setHeroSpellColor}
              heroIndex={heroIndex}
              currentColor={currentColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "300px",
    height: "200px",
    backgroundColor: "#e1bee7",
    padding: "20px",
    borderRadius: "5px",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  close: {
    position: "absolute",
    top: "10px",
    right: "15px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#6a1b9a",
  },
};

export default Modal;
