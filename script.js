document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis e Seletores do Sistema de Criação de Personagem ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const characterCreationMenu = document.getElementById('character-creation-menu');
    const raceSelectionScreen = document.getElementById('race-selection-screen');
    const statusScreen = document.getElementById('status-screen'); // Este será o statusView

    const openMenuButton = document.getElementById('open-menu-button');
    const characterNameInput = document.getElementById('character-name');
    const nextToRaceButton = document.getElementById('next-to-race-button');
    const raceButtons = document.querySelectorAll('.race-button');
    const attributeChoiceDiv = document.getElementById('attribute-choice');
    const rollDiceButton = document.getElementById('roll-dice-button');
    const manualAttributesButton = document.getElementById('manual-attributes-button');
    const rolledAttributesDiv = document.getElementById('rolled-attributes');
    const nextToStatusButton = document.getElementById('next-to-status-button');

    const displayName = document.getElementById('display-name');
    const displayRace = document.getElementById('display-race');
    const displayForca = document.getElementById('display-forca');
    const displayVigor = document.getElementById('display-vigor');
    const displayAgilidade = document.getElementById('display-agilidade');
    const displayInteligencia = document.getElementById('display-inteligencia');
    const displaySabedoria = document.getElementById('display-sabedoria');
    const displaySorte = document.getElementById('display-sorte');
    const displayCarisma = document = document.getElementById('display-carisma');
    const displayTamanho = document.getElementById('display-tamanho');
    const displayAparencia = document.getElementById('display-aparencia');

    // O objeto currentCharacter agora faz parte do estado geral do perfil
    let currentCharacter = {
        name: '',
        race: '',
        attributes: {}
    };

    // --- Variáveis e Seletores do Sistema de Perícias ---
    const periciasLista = [
        "Charme", "Intimidação", "Lábia", "Acalmar",
        "Artes", "Ciências", "Investigação", "Alquimia", "Engenharia",
        "Percepção", "Raciocínio", "Medicina", "Sobrevivência",
        "Fortitude", "Mergulho", "Vontade",
        "Escalar", "Lutar (varia)", "Operação", "Furtividade", "Pontaria",
        "Crime", "Natação", "Saltar", "Prestidigitação", "Pilotagem",
        "Intuição", "Encontrar", "Adestrar"
    ];

    const togglePerfisBtn = document.getElementById('togglePerfisBtn');
    const configPerfisWrapper = document.getElementById('configPerfisWrapper');
    const mensagemPerfil = document.getElementById('mensagemPerfil');

    const salvarPerfil1Btn = document.getElementById('salvarPerfil1');
    const carregarPerfil1Btn = document.getElementById('carregarPerfil1');
    const salvarPerfil2Btn = document.getElementById('salvarPerfil2');
    const carregarPerfil2Btn = document.getElementById('carregarPerfil2');
    const salvarPerfil3Btn = document.getElementById('salvarPerfil3');
    const carregarPerfil3Btn = document.getElementById('carregarPerfil3');

    const mainFloatingBtn = document.getElementById('mainFloatingBtn');
    const floatingNav = document.querySelector('.floating-nav');
    const showPericiasBtn = document.getElementById('showPericiasBtn');
    const showStatusBtn = document.getElementById('showStatusBtn');

    const appContentArea = document.getElementById('app-content-area');

    let periciasView;
    let statusView; // Já temos statusScreen do primeiro código, vamos usá-lo como statusView
    let searchInput;
    let periciasContainer;
    let resetarBtn;

    // --- FUNÇÕES COMPARTILHADAS/UTILITY ---

    function rollDice(diceString) {
        let total = 0;
        const parts = diceString.split('+');
        const dicePart = parts[0];
        const numDice = parseInt(dicePart.split('D')[0]);
        const dieType = parseInt(dicePart.split('D')[1]);

        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieType) + 1;
        }

        if (parts.length > 1) {
            total += parseInt(parts[1]);
        }
        return total;
    }

    const raceAttributes = {
        "Humano": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "3D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "3D6",
            "Carisma": "3D6", "Tamanho": "2D6+6", "Aparência": "3D6"
        },
        "Villager": {
            "Força": "2D6", "Vigor": "3D6", "Agilidade": "3D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "3D6",
            "Carisma": "3D6+6", "Tamanho": "2D6+6", "Aparência": "2D6"
        },
        "Anão": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "2D6",
            "Inteligência": "2D6+12", "Sabedoria": "0", "Sorte": "3D6",
            "Carisma": "3D6", "Tamanho": "2D4+3", "Aparência": "3D6"
        },
        "Elfo": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "4D6",
            "Inteligência": "2D6+6", "Sabedoria": "1D4", "Sorte": "3D6",
            "Carisma": "2D6", "Tamanho": "2D6+6", "Aparência": "2D6"
        },
        "Fada": {
            "Força": "2D6", "Vigor": "2D6", "Agilidade": "4D6",
            "Inteligência": "2D6+6", "Sabedoria": "1D6+4", "Sorte": "3D6",
            "Carisma": "3D6", "Tamanho": "2D6+1", "Aparência": "3D6"
        },
        "Golem": {
            "Força": "4D6", "Vigor": "4D6", "Agilidade": "3D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "2D6",
            "Carisma": "3D6", "Tamanho": "4D6", "Aparência": "3D6"
        },
        "Gnomo": {
            "Força": "3D6", "Vigor": "3D6", "Agilidade": "4D6",
            "Inteligência": "2D6+6", "Sabedoria": "0", "Sorte": "3D6+6",
            "Carisma": "3D6", "Tamanho": "2D4+1", "Aparência": "3D6"
        },
        "Sereia": {
            "Força": "3D6", "Vigor": "4D6", "Agilidade": "3D6",
            "Inteligência": "2D6", "Sabedoria": "0", "Sorte": "2D6",
            "Carisma": "4D6", "Tamanho": "2D6+6", "Aparência": "3D6"
        }
    };

    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active-view');
            section.style.display = 'none';
        });

        screenToShow.classList.add('active');
        screenToShow.style.display = 'flex';

        if (screenToShow.id === 'character-creation-menu') {
            screenToShow.classList.add('open');
        } else {
            characterCreationMenu.classList.remove('open');
        }

        floatingNav.classList.remove('active');
    }

    function togglePerfisVisibility() {
        configPerfisWrapper.classList.toggle('active');
    }

    function exibirMensagem(texto, tipo = '') {
        mensagemPerfil.textContent = texto;
        mensagemPerfil.className = `mensagem-perfil ${tipo}`;
        setTimeout(() => {
            mensagemPerfil.textContent = '';
            mensagemPerfil.className = 'mensagem-perfil';
        }, 3000);
    }

    /**
     * Carrega um perfil completo (perícias + dados do personagem) do Local Storage.
     * @param {string} perfilKey Chave do perfil no Local Storage.
     * @returns {object} Objeto contendo os dados do personagem e as perícias, ou um objeto vazio.
     */
    function carregarPerfilCompleto(perfilKey) {
        const savedData = localStorage.getItem(perfilKey);
        return savedData ? JSON.parse(savedData) : { character: {}, pericias: {} };
    }

    /**
     * Salva o estado atual completo (perícias + dados do personagem) no Local Storage para um perfil específico.
     * @param {string} perfilKey Chave do perfil no Local Storage.
     */
    function salvarPerfilCompleto(perfilKey) {
        const valoresPericias = {};
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                valoresPericias[`pericia-${index}`] = inputPericia.value;
            }
        });

        const dataToSave = {
            character: currentCharacter,
            pericias: valoresPericias
        };

        localStorage.setItem(perfilKey, JSON.stringify(dataToSave));
        exibirMensagem(`Perfil ${perfilKey.replace('perfil', '')} salvo!`, 'sucesso');
    }

    /**
     * Aplica os valores carregados de um perfil aos inputs das perícias e ao objeto do personagem.
     * @param {object} loadedData Objeto com dados do personagem e perícias.
     */
    function aplicarPerfilCarregado(loadedData) {
        // Aplica dados do personagem
        currentCharacter = loadedData.character || { name: '', race: '', attributes: {} };
        updateCharacterDisplay(); // Atualiza a exibição na tela de status
        characterNameInput.value = currentCharacter.name || ''; // Atualiza o input de nome

        // Se houver uma raça selecionada, aplica a classe 'selected' ao botão
        raceButtons.forEach(btn => {
            if (btn.dataset.race === currentCharacter.race) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Se houver atributos rolados, mostra-os
        if (currentCharacter.attributes && Object.keys(currentCharacter.attributes).length > 0) {
            rolledAttributesDiv.innerHTML = '<h3>Atributos Rolados:</h3><ul>';
            for (const attr in currentCharacter.attributes) {
                rolledAttributesDiv.innerHTML += `<li>${attr}: ${currentCharacter.attributes[attr]}</li>`;
            }
            rolledAttributesDiv.innerHTML += '</ul>';
            rolledAttributesDiv.classList.remove('hidden');
            nextToStatusButton.classList.remove('hidden');
            attributeChoiceDiv.classList.remove('hidden'); // Certifica que a div de escolha de atributos está visível
        } else {
            rolledAttributesDiv.innerHTML = '';
            rolledAttributesDiv.classList.add('hidden');
            nextToStatusButton.classList.add('hidden');
            attributeChoiceDiv.classList.add('hidden'); // Oculta se não houver atributos
        }


        // Aplica valores das perícias
        const loadedPericias = loadedData.pericias || {};
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                inputPericia.value = loadedPericias[`pericia-${index}`] || "50";
            }
        });
        filterPericias(); // Reaplicar filtro após carregar novos valores
    }

    /**
     * Salva o estado atual (perícias e dados do personagem) no perfil 'perfilAtual'.
     * Chamado a cada mudança nos inputs ou dados do personagem.
     */
    function salvarPerfilAtual() {
        salvarPerfilCompleto('perfilAtual');
    }

    /**
     * Carrega o perfil 'perfilAtual' ao iniciar a aplicação.
     */
    function carregarPerfilInicial() {
        const loadedData = carregarPerfilCompleto('perfilAtual');
        if (Object.keys(loadedData.character).length > 0 || Object.keys(loadedData.pericias).length > 0) {
            aplicarPerfilCarregado(loadedData);
            exibirMensagem("Valores do último uso carregados!", 'info');
        } else {
            exibirMensagem("Iniciado com valores padrão (50) e personagem vazio.", 'info');
        }
    }

    function updateCharacterDisplay() {
        displayName.textContent = currentCharacter.name || 'N/A';
        displayRace.textContent = currentCharacter.race || 'N/A';
        displayForca.textContent = currentCharacter.attributes.Força || 0;
        displayVigor.textContent = currentCharacter.attributes.Vigor || 0;
        displayAgilidade.textContent = currentCharacter.attributes.Agilidade || 0;
        displayInteligencia.textContent = currentCharacter.attributes.Inteligencia || 0;
        displaySabedoria.textContent = currentCharacter.attributes.Sabedoria || 0;
        displaySorte.textContent = currentCharacter.attributes.Sorte || 0;
        displayCarisma.textContent = currentCharacter.attributes.Carisma || 0;
        displayTamanho.textContent = currentCharacter.attributes.Tamanho || 0;
        displayAparencia.textContent = currentCharacter.attributes.Aparência || 0;
    }

    function rolarD100() {
        return Math.floor(Math.random() * 100) + 1;
    }

    function determinarResultado(valorPericia, rolagem) {
        valorPericia = parseInt(valorPericia, 10);

        if (isNaN(valorPericia) || valorPericia < 1 || valorPericia > 100) {
            return { tipo: "Valor inválido (1-100)", classe: "erro-classificacao" };
        }

        if (rolagem === 100) {
            return { tipo: "FRACASSO TOTAL!", classe: "fracasso-total" };
        }

        if (rolagem > valorPericia) {
            return { tipo: "Fracasso!", classe: "fracasso" };
        }

        if (rolagem === 1 || rolagem === valorPericia) {
            return { tipo: "SUCESSO PERFEITO!", classe: "sucesso-perfeito" };
        }

        const limiteOtimo = Math.ceil(valorPericia * 0.82);
        const limiteBom = Math.ceil(valorPericia * 0.50);

        if (rolagem >= limiteOtimo) {
            return { tipo: "Sucesso Ótimo!", classe: "sucesso-otimo" };
        } else if (rolagem >= limiteBom) {
            return { tipo: "Sucesso Bom!", classe: "sucesso-bom" };
        } else {
            return { tipo: "Sucesso Normal!", classe: "sucesso-normal" };
        }
    }

    function filterPericias() {
        if (!searchInput || !periciasContainer) return;
        const searchTerm = searchInput.value.toLowerCase();
        const periciaItems = periciasContainer.querySelectorAll('.pericia-item');

        periciaItems.forEach(item => {
            const periciaNome = item.dataset.periciaNome;
            if (periciaNome.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    /**
     * Reinicia todos os valores das perícias, dados do personagem e limpa os perfis salvos.
     */
    function resetarTudo() {
        // Limpa as perícias na UI e Local Storage
        periciasLista.forEach((_, index) => {
            const inputPericia = document.getElementById(`pericia-${index}`);
            const resultadoDiv = document.getElementById(`resultado-${index}`);
            if (inputPericia) inputPericia.value = "50";
            if (resultadoDiv) {
                resultadoDiv.textContent = "";
                resultadoDiv.className = 'resultado';
            }
        });

        // Limpa os dados do personagem na UI e Local Storage
        currentCharacter = { name: '', race: '', attributes: {} };
        characterNameInput.value = '';
        updateCharacterDisplay();
        rolledAttributesDiv.innerHTML = '';
        rolledAttributesDiv.classList.add('hidden');
        nextToStatusButton.classList.add('hidden');
        attributeChoiceDiv.classList.add('hidden');
        raceButtons.forEach(btn => btn.classList.remove('selected'));

        // Remove todos os perfis completos salvos
        localStorage.removeItem('perfil1');
        localStorage.removeItem('perfil2');
        localStorage.removeItem('perfil3');
        localStorage.removeItem('perfilAtual');

        exibirMensagem("Todos os perfis e valores resetados!", 'info');
        if (searchInput) searchInput.value = '';
        filterPericias();
    }

    function gerarPericiasNoHTML() {
        if (!periciasContainer) {
            console.error("periciasContainer não encontrado ao tentar gerar perícias.");
            return;
        }
        periciasContainer.innerHTML = '';
        periciasLista.forEach((periciaNome, index) => {
            const periciaDiv = document.createElement('div');
            periciaDiv.classList.add('pericia-item');
            periciaDiv.dataset.periciaNome = periciaNome.toLowerCase();

            periciaDiv.innerHTML = `
                <label for="pericia-${index}">${periciaNome}:</label>
                <input type="number" id="pericia-${index}" value="50" min="1" max="100">
                <button data-pericia-index="${index}">Rolar d100</button>
                <div class="resultado" id="resultado-${index}"></div>
            `;
            periciasContainer.appendChild(periciaDiv);

            const inputPericia = document.getElementById(`pericia-${index}`);
            if (inputPericia) {
                inputPericia.addEventListener('change', salvarPerfilAtual);
                inputPericia.addEventListener('keyup', salvarPerfilAtual);
            }
        });
    }

    // --- FUNÇÕES DE INICIALIZAÇÃO DE SEÇÕES ---

    function initializeSections() {
        periciasView = document.createElement('div');
        periciasView.id = 'periciasView';
        periciasView.classList.add('content-section', 'screen');
        periciasView.innerHTML = `
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Pesquisar perícia...">
            </div>
            <section class="pericias-container"></section>
            <div class="botoes-globais">
                <button id="resetarBtn">Reiniciar Teste</button>
            </div>
        `;
        appContentArea.appendChild(periciasView);

        statusView = statusScreen;

        searchInput = periciasView.querySelector('#searchInput');
        periciasContainer = periciasView.querySelector('.pericias-container');
        resetarBtn = periciasView.querySelector('#resetarBtn');
    }

    // --- CONFIGURAÇÃO DE EVENT LISTENERS ---

    function setupEventListeners() {
        openMenuButton.addEventListener('click', () => {
            showScreen(characterCreationMenu);
        });

        nextToRaceButton.addEventListener('click', () => {
            const charName = characterNameInput.value.trim();
            if (charName) {
                currentCharacter.name = charName;
                salvarPerfilAtual();
                showScreen(raceSelectionScreen);
            } else {
                alert('Por favor, digite o nome do personagem!');
            }
        });

        characterNameInput.addEventListener('input', salvarPerfilAtual); // Salva ao digitar

        raceButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                raceButtons.forEach(btn => btn.classList.remove('selected'));
                event.target.classList.add('selected');

                currentCharacter.race = event.target.dataset.race;
                salvarPerfilAtual();
                attributeChoiceDiv.classList.remove('hidden');
                rolledAttributesDiv.innerHTML = '';
                rolledAttributesDiv.classList.add('hidden');
                nextToStatusButton.classList.add('hidden');
            });
        });

        rollDiceButton.addEventListener('click', () => {
            const selectedRace = currentCharacter.race;
            if (selectedRace) {
                const attributesToRoll = raceAttributes[selectedRace];
                let rolled = {};
                rolledAttributesDiv.innerHTML = '<h3>Atributos Rolados:</h3><ul>';
                for (const attr in attributesToRoll) {
                    const value = rollDice(attributesToRoll[attr]);
                    rolled[attr] = value;
                    rolledAttributesDiv.innerHTML += `<li>${attr}: ${value}</li>`;
                }
                rolledAttributesDiv.innerHTML += '</ul>';
                rolledAttributesDiv.classList.remove('hidden');
                nextToStatusButton.classList.remove('hidden');
                currentCharacter.attributes = rolled;
                salvarPerfilAtual();
            } else {
                alert('Por favor, selecione uma raça primeiro!');
            }
        });

        manualAttributesButton.addEventListener('click', () => {
            alert('Funcionalidade de entrada manual de atributos em desenvolvimento...');
        });

        nextToStatusButton.addEventListener('click', () => {
            updateCharacterDisplay();
            showScreen(statusView);
            mainFloatingBtn.style.display = 'flex';
        });

        togglePerfisBtn.addEventListener('click', togglePerfisVisibility);
        configPerfisWrapper.addEventListener('click', (event) => {
            if (event.target === configPerfisWrapper) {
                togglePerfisVisibility();
            }
        });

        // Eventos dos botões de salvar/carregar perfil
        salvarPerfil1Btn.addEventListener('click', () => salvarPerfilCompleto('perfil1'));
        carregarPerfil1Btn.addEventListener('click', () => {
            const loadedData = carregarPerfilCompleto('perfil1');
            if (Object.keys(loadedData.character).length > 0 || Object.keys(loadedData.pericias).length > 0) {
                aplicarPerfilCarregado(loadedData);
                exibirMensagem("Perfil 1 carregado!", 'sucesso');
                salvarPerfilAtual(); // Define o perfil carregado como o perfil atual
            } else {
                exibirMensagem("Perfil 1 vazio! Salve primeiro.", 'fracasso');
            }
        });

        salvarPerfil2Btn.addEventListener('click', () => salvarPerfilCompleto('perfil2'));
        carregarPerfil2Btn.addEventListener('click', () => {
            const loadedData = carregarPerfilCompleto('perfil2');
            if (Object.keys(loadedData.character).length > 0 || Object.keys(loadedData.pericias).length > 0) {
                aplicarPerfilCarregado(loadedData);
                exibirMensagem("Perfil 2 carregado!", 'sucesso');
                salvarPerfilAtual();
            } else {
                exibirMensagem("Perfil 2 vazio! Salve primeiro.", 'fracasso');
            }
        });

        salvarPerfil3Btn.addEventListener('click', () => salvarPerfilCompleto('perfil3'));
        carregarPerfil3Btn.addEventListener('click', () => {
            const loadedData = carregarPerfilCompleto('perfil3');
            if (Object.keys(loadedData.character).length > 0 || Object.keys(loadedData.pericias).length > 0) {
                aplicarPerfilCarregado(loadedData);
                exibirMensagem("Perfil 3 carregado!", 'sucesso');
                salvarPerfilAtual();
            } else {
                exibirMensagem("Perfil 3 vazio! Salve primeiro.", 'fracasso');
            }
        });

        if (searchInput) {
            searchInput.addEventListener('keyup', filterPericias);
            searchInput.addEventListener('change', filterPericias);
        }
        if (resetarBtn) {
            resetarBtn.addEventListener('click', resetarTudo);
        }

        if (periciasContainer) {
            periciasContainer.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-pericia-index')) {
                    const index = event.target.dataset.periciaIndex;
                    const inputPericia = document.getElementById(`pericia-${index}`);
                    const resultadoDiv = document.getElementById(`resultado-${index}`);

                    if (inputPericia && resultadoDiv) {
                        const valorPericia = inputPericia.value;
                        const rolagem = rolarD100();
                        const resultado = determinarResultado(valorPericia, rolagem);

                        resultadoDiv.textContent = `Rolagem: ${rolagem} - ${resultado.tipo}`;
                        resultadoDiv.className = `resultado ${resultado.classe}`;

                        salvarPerfilAtual();
                    }
                }
            });
        }

        mainFloatingBtn.addEventListener('click', (event) => {
            floatingNav.classList.toggle('active');
            event.stopPropagation();
        });

        document.addEventListener('click', (event) => {
            if (!floatingNav.contains(event.target) && floatingNav.classList.contains('active')) {
                floatingNav.classList.remove('active');
            }
        });

        showPericiasBtn.addEventListener('click', () => showScreen(periciasView));
        showStatusBtn.addEventListener('click', () => {
            updateCharacterDisplay();
            showScreen(statusView);
        });
    }

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    initializeSections();
    gerarPericiasNoHTML();
    setupEventListeners();

    carregarPerfilInicial(); // Carrega o perfil inicial (se houver)
    showScreen(welcomeScreen); // Inicia na tela de boas-vindas
});
