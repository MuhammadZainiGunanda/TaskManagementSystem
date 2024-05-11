import { webApplicaiton } from './app/web';

webApplicaiton.listen(3000, (): void => {
     console.info("Server running on port 3000");
});