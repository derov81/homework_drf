import Button from "../Button/Button";
import AuthService from "../services/authService";

export default function TabsSection({active, onChange}) {
    const userAdmin = AuthService.getCurrentUser();

    return (
        <section style={{marginBottom: '1rem'}}>
            <Button isActive={active === 'main'} onClick={() => onChange('main')}>Каталог</Button>

            {/* Показывать вкладку "Обратная связь", если пользователь НЕ админ */}
            {(!userAdmin || userAdmin.username !== 'admin') && (
                <Button isActive={active === 'feedback'} onClick={() => onChange('feedback')}>Обратная связь</Button>
            )}

            {/* Вкладка "Административная панель" только для админа */}
            {userAdmin && userAdmin.username === 'admin' && (
                <Button isActive={active === 'admin_panel'} onClick={() => onChange('admin_panel')}>Административная панель</Button>
            )}

            <Button isActive={active === 'about'} onClick={() => onChange('about')}>О нас</Button>
        </section>
    );
}
